import dialogPolyfill from 'dialog-polyfill';

export default function checkDialog() {
    const dialogPolyfillEl = dialogPolyfill;
    const isBrowserNotSupportDialog = window.HTMLDialogElement === undefined;
    if (isBrowserNotSupportDialog) {
        const dialogs = document.querySelectorAll("dialog");
    
        dialogs.forEach(async (dialog) => {
        const { default: polyfill } = await import(dialogPolyfillEl);
        polyfill.registerDialog(dialog);
        });
    }
}