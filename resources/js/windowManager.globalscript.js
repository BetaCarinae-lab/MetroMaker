export let currentPopupInfo = {
    html: null,
    allowClickToClose: true
};
export function showPopup(html, allowClickToClose = true) {
    if (html != null) {
        throw new Error("Popup cannot be overridden");
    }
    document.getElementById("popup-content").innerHTML = html;
    currentPopupInfo.allowClickToClose = allowClickToClose;
    currentPopupInfo.html = html;
    document.getElementById("popup-overlay").style.display = "flex";
}
export function getRef() {
    return document.getElementById("popup-content");
}
export function hidePopup() {
    document.getElementById("popup-overlay").style.display = "none";
}
document.querySelector(".popup-close").addEventListener("click", function () {
    if (currentPopupInfo.allowClickToClose) {
        hidePopup();
    }
    else {
        return;
    }
});
//# sourceMappingURL=windowManager.globalscript.js.map