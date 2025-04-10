export function getContentType(container, codec) {
    return `${container}; codecs="${codec}"`;
}
const htmlVideoElement = document.createElement("video");
export function isCodecSupported(container, codec) {
    var _a;
    return {
        mse: (_a = window.MediaSource) === null || _a === void 0 ? void 0 : _a.isTypeSupported(getContentType(container, codec)),
        htmlVideoElement: !!htmlVideoElement.canPlayType(getContentType(container, codec)),
    };
}
