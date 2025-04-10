var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getContentType, isCodecSupported } from "./codec";
import { isDrmSupported } from "./drm";
export * from "./types";
export function canivideo(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            supported: false,
            codecs: {},
        };
        for (const codec of options.codecs) {
            const api = isCodecSupported(options.container, codec);
            const drm = yield Promise.all(options.drm.map((drm) => isDrmSupported(drm, getContentType(options.container, codec))));
            result.codecs[codec] = {
                api,
                drm
            };
        }
        return result;
    });
}
export const isVideoSupported = canivideo;
