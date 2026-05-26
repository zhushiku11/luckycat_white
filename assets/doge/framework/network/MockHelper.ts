import Crypto from "../common/Crypto";
import { sys } from "cc";
import { EDITOR } from "cc/env";

let open = true;
if (!EDITOR) {
    if (sys.os == sys.OS.ANDROID) {
        open = false;
    }
    if (sys.os == sys.OS.IOS) {
        open = false;
    }
}

// let open = true;
// if (!EDITOR) {
//     if (sys.os == sys.OS.ANDROID) {
//         open = false;
//     }
//     if (sys.os == sys.OS.IOS) {
//         open = false;
//     }
// }

const MOCK_DATA = {};

export class MockHelper {
    public static mock(url: string): string {
        if (!open) {
            return null;
        }

        let data = MOCK_DATA[url.split("?")[0]];
        if (data) {
            let pack = JSON.stringify({
                code: 200,
                data: Crypto.encryptXXTEA(JSON.stringify(data)),
            });
            return pack;
        } else {
            let pack = JSON.stringify({
                code: 200,
            });
            return pack;
        }
    }
}

export default MOCK_DATA;


