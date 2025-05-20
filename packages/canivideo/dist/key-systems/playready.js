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
export function isPlayreadySupported(_a) {
    return __awaiter(this, arguments, void 0, function* ({ contentType, keySystem, encryption, }) {
        const securityLevels = (yield Promise.allSettled(["3000", "2000", "150"].map((level) => __awaiter(this, void 0, void 0, function* () {
            const supported = yield isKeySystemSupported(keySystem, contentType, encryption, level);
            return {
                name: level,
                supported,
            };
        }))))
            .map((settled) => {
            if (settled.status === "rejected") {
                return;
            }
            return settled.value;
        })
            .filter((level) => !!level);
        return {
            keySystem,
            supported: securityLevels.some((level) => level.supported),
            securityLevels,
        };
    });
}
