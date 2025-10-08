let icons = {
    default: { path: { "48": "icons/TDX_ID_COPY_ICON_48px.png" } },
    success: { path: { "48": "icons/checkmark.png" } },
    error: { path: { "48": "icons/error.png" } }
}

// Verifies if current page is a TDX page. 
browser.webNavigation.onCompleted.addListener( (details) => {
    let regex = /(https:\/\/[a-z0-9\.]+\/TDWorkManagement\/|https:\/\/[a-z0-9\.]+\/TDNext\/)/;
    let isEnabled = browser.browserAction.isEnabled({tabId: details.tabId, windowId: details.windowId})
    if(regex.test(details.url)) {
        if(!isEnabled) browser.browserAction.enable(details.tabId)
    } else {
        if(isEnabled) browser.browserAction.disable(details.tabId)
    }
})

browser.browserAction.onClicked.addListener(async (tab) => {
  let func = () => {
    let frameEl = document.querySelector(".tdx-right-side-panel__iframe");
    if (!frameEl) throw new Error("TDX iframe not found");

    let url = frameEl.src;
    try { new URL(url); } catch { throw new Error("Invalid URL"); }

    let slug = url.split("/").at(-1).split("?");
    if (slug[0] !== "TicketDet.aspx" || slug.length < 2)
      throw new Error("Not a TDX TicketDet URL");

    let [key, val] = slug[1].split("=");
    if (key !== "TicketID") throw new Error("No TicketID query param");

    let ticketID = val;
    let htmlBlob = new Blob( ['<a href="' + url + '" target="_blank">' + ticketID + "</a>"], { type: "text/html" } );
    let textBlob = new Blob( [ticketID + ": " + url], { type: "text/plain" } );
    let item = new ClipboardItem({ "text/html": htmlBlob, "text/plain": textBlob });
    console.log('Copying:' + ticketID)
    return navigator.clipboard.write([item]);
  };

  try {
    if (browser.scripting?.executeScript) await browser.scripting.executeScript({ target: { tabId: tab.id }, func}); 
    else await browser.tabs.executeScript(tab.id, { code: `(${func})();`});
    changeIcon(true);
    console.log("Copied ticket to clipboard.");
  } catch (e) {
    changeIcon(false);
    console.error("Copy failed:", e);
  }
});

function changeIcon(icon){
    if(icon)
        browser.browserAction.setIcon(icons.success);
    else 
        browser.browserAction.setIcon(icons.error);
    setTimeout(()=>{browser.browserAction.setIcon(icons.default)}, 500)
}