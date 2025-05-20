export function isKeySystemSupported(keySystem, contentType, encryption, robustness = "") {
    if (navigator.requestMediaKeySystemAccess) {
        return navigator
            .requestMediaKeySystemAccess(keySystem, [
            {
                initDataTypes: ['cenc', 'sinf', 'skd', 'keyids'],
                videoCapabilities: [
                    {
                        contentType,
                        robustness,
                        encryptionScheme: encryption,
                    },
                ],
            },
        ])
            .then((access) => access.createMediaKeys())
            .then(() => true)
            .catch(() => false);
    }
    else {
        return Promise.resolve(false);
    }
}
