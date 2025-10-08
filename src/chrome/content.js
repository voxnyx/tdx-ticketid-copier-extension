// content.js
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "COPY_TDX") return;

  const run = async () => {
    const frameEl = document.querySelector(".tdx-right-side-panel__iframe");
    if (!frameEl) throw new Error("TDX iframe not found");

    const url = frameEl.src;
    try { new URL(url); } catch { throw new Error("Invalid URL"); }

    const slug = url.split("/").at(-1).split("?");
    if (slug[0] !== "TicketDet.aspx" || slug.length < 2)
      throw new Error("Not a TDX TicketDet URL");

    const [key, val] = slug[1].split("=");
    if (key !== "TicketID") throw new Error("No TicketID query param");

    const ticketID = val;
    const htmlBlob = new Blob([`<a href="${url}" target="_blank">${ticketID}</a>`], { type: "text/html" });
    const textBlob = new Blob([`${ticketID}: ${url}`], { type: "text/plain" });
    const item = new ClipboardItem({ "text/html": htmlBlob, "text/plain": textBlob });
    await navigator.clipboard.write([item]);
    console.log("Copied:", ticketID);
  };

  (async () => {
    try {
      await run();
      sendResponse({ ok: true });
    } catch (e) {
      console.error(e);
      sendResponse({ ok: false, error: e?.message || String(e) });
    }
  })();

  return true; // keep the message port open for the async work
});
