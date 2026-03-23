chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.storage.local.set({ beatsketchKeepalive: Date.now() });
  } catch {
    // no-op
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "BEATSKETCH_PING") {
    sendResponse({ ok: true, at: Date.now() });
  }
  return true;
});
