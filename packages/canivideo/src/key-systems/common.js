"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKeySystemSupported = isKeySystemSupported;
function isKeySystemSupported(keySystem, contentType, encryption, robustness) {
    if (robustness === void 0) { robustness = ""; }
    if (navigator.requestMediaKeySystemAccess) {
        return navigator
            .requestMediaKeySystemAccess(keySystem, [
            {
                initDataTypes: ['cenc', 'sinf', 'skd', 'keyids'],
                videoCapabilities: [
                    {
                        contentType: contentType,
                        robustness: robustness,
                        encryptionScheme: encryption,
                    },
                ],
            },
        ])
            .then(function (access) { return access.createMediaKeys(); })
            .then(function () { return true; })
            .catch(function () { return false; });
    }
    else {
        return Promise.resolve(false);
    }
}
