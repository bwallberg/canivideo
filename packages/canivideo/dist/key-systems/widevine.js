var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isKeySystemSupported } from "./common";
export function isWidevineSupported(_a) {
    return __awaiter(this, arguments, void 0, function* ({ contentType, encryption, }) {
        const supportedRobustness = (yield Promise.all(["HW_SECURE_ALL", "HW_SECURE_CRYPTO", "SW_SECURE_CRYPTO"].map((robustness) => isKeySystemSupported("com.widevine.alpha", contentType, encryption, robustness).then((supported) => (supported ? robustness : null))))).filter((robustness) => !!robustness);
        return {
            keySystem: "com.widevine.alpha",
            supported: supportedRobustness.length > 0,
            securityLevels: [
                {
                    name: "L1",
                    supported: supportedRobustness.includes("HW_SECURE_ALL"),
                },
                {
                    name: "L2",
                    supported: supportedRobustness.includes("HW_SECURE_CRYPTO"),
                },
                {
                    name: "L3",
                    supported: supportedRobustness.includes("SW_SECURE_CRYPTO"),
                },
            ],
        };
    });
}
