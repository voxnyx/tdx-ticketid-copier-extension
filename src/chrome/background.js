// background.js
const icons = {
  default: "icons/TDX_ID_COPY_ICON_48px.png",
  success: "icons/checkmark.png",
  error: "icons/error.png",
};

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Clicking the action gives you activeTab permission for this tab
    await chrome.tabs.sendMessage(tab.id, { type: "COPY_TDX" });
    changeIcon(tab.id, true);
  } catch (e) {
    changeIcon(tab.id, false);
    console.error("Copy failed:", e);
  }
});

function changeIcon(tabId, ok) {
  chrome.action.setIcon({ tabId, path: ok ? icons.success : icons.error });
  setTimeout(() => chrome.action.setIcon({ tabId, path: icons.default }), 500);
}
