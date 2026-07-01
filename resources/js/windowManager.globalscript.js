export let currentPopupInfo = {
    html: '',
    allowClickToClose: true
};
export function showPopup(html, allowClickToClose = true) {
    document.getElementById("popup-content").innerHTML = html;
    document.getElementById("popup-overlay").style.display = "flex";
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