
import CryptoES from 'crypto-es';

// 十六位十六进制数作为密钥
const KEY = CryptoES.enc.Utf8.parse("WANKEYUN");
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoES.enc.Utf8.parse("");
// XXTea密钥
const XXTEA_KEY = "CatSpin@520Lyk";

export default class Crypto {

    /** ECB加密 */
    public static encryptECB(word: string) {
        if (!word) {
            return word;
        }
        const encrypted = CryptoES.AES.encrypt(word, KEY, {
            mode: CryptoES.mode.ECB,
            padding: CryptoES.pad.Pkcs7
        });
        return CryptoES.enc.Base64.stringify(encrypted.ciphertext);
    }

    /** ECB解密 */
    public static decryptECB(word: string) {
        if (!word) {
            return word;
        }
        const decrypt = CryptoES.AES.decrypt(word, KEY, {
            mode: CryptoES.mode.ECB,
            padding: CryptoES.pad.Pkcs7
        });
        return decrypt.toString(CryptoES.enc.Utf8);
    }

    /** CBC加密 */
    public static encryptCBC(word: string) {
        if (!word) {
            return word;
        }
        const srcs = CryptoES.enc.Utf8.parse(word);
        const encrypted = CryptoES.AES.encrypt(srcs, KEY, {
            // keySize: 128 / 8,
            iv: SECRET_IV,
            mode: CryptoES.mode.CBC,
            padding: CryptoES.pad.Pkcs7
        });
        let result = CryptoES.enc.Hex.parse(encrypted.ciphertext.toString())

        let resultStr = result.toString().toUpperCase();

        return resultStr;
    }

    /** CBC解密 */
    public static decryptCBC(word: string) {
        if (!word) {
            return word;
        }
        const encryptedHexStr = CryptoES.enc.Hex.parse(word);
        const srcs = CryptoES.enc.Base64.stringify(encryptedHexStr);
        const decrypt = CryptoES.AES.decrypt(srcs, KEY, {
            // keySize: 128 / 8,
            iv: SECRET_IV,
            mode: CryptoES.mode.CBC,
            padding: CryptoES.pad.Pkcs7
        });
        const decryptedStr = decrypt.toString(CryptoES.enc.Utf8);
        let str = decryptedStr.toString();
        return str;
    }

     /** MD5 */
     public static MD5(word: string) {
        return CryptoES.MD5(word).toString();
     }

    /** XXTEA加密（返回Base64字符串） */
    public static encryptXXTEA(data: string) {
        return XXTea.I.encryptToBase64(data, XXTEA_KEY);
    }

    /** XXTEA解密（解密base64字符串）*/
    public static decryptXXTEA(data: string) {
        return XXTea.I.decryptFromBase64(data, XXTEA_KEY);
    }

}

class XXTea {

    private static _instance = null;
    public static get I(): XXTea {
        if (!XXTea._instance) {
            XXTea._instance = new XXTea();
        }
        return XXTea._instance;
    }

    private DELTA = 0x9E3779B9;
    private base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    private base64DecodeChars = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ];

    btoa(str) {
        var buf, i, j, len, r, l, c;
        i = j = 0;
        len = str.length;
        r = len % 3;
        len = len - r;
        l = (len / 3) << 2;
        if (r > 0) {
            l += 4;
        }
        buf = new Array(l);

        while (i < len) {
            c = str.charCodeAt(i++) << 16 |
                str.charCodeAt(i++) << 8 |
                str.charCodeAt(i++);
            buf[j++] = this.base64EncodeChars[c >> 18] +
                this.base64EncodeChars[c >> 12 & 0x3f] +
                this.base64EncodeChars[c >> 6 & 0x3f] +
                this.base64EncodeChars[c & 0x3f];
        }
        if (r == 1) {
            c = str.charCodeAt(i++);
            buf[j++] = this.base64EncodeChars[c >> 2] +
                this.base64EncodeChars[(c & 0x03) << 4] +
                "==";
        }
        else if (r == 2) {
            c = str.charCodeAt(i++) << 8 |
                str.charCodeAt(i++);
            buf[j++] = this.base64EncodeChars[c >> 10] +
                this.base64EncodeChars[c >> 4 & 0x3f] +
                this.base64EncodeChars[(c & 0x0f) << 2] +
                "=";
        }
        return buf.join('');
    }

    atob(str) {

        var c1, c2, c3, c4;
        var i, j, len, r, l, out;

        len = str.length;
        if (len % 4 !== 0) {
            return '';
        }
        if (/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\+\/\=]/.test(str)) {
            return '';
        }
        if (str.charAt(len - 2) == '=') {
            r = 1;
        }
        else if (str.charAt(len - 1) == '=') {
            r = 2;
        }
        else {
            r = 0;
        }
        l = len;
        if (r > 0) {
            l -= 4;
        }
        l = (l >> 2) * 3 + r;
        out = new Array(l);

        i = j = 0;
        while (i < len) {
            // c1
            c1 = this.base64DecodeChars[str.charCodeAt(i++)];
            if (c1 == -1) break;

            // c2
            c2 = this.base64DecodeChars[str.charCodeAt(i++)];
            if (c2 == -1) break;

            out[j++] = String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            // c3
            c3 = this.base64DecodeChars[str.charCodeAt(i++)];
            if (c3 == -1) break;

            out[j++] = String.fromCharCode(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2));

            // c4
            c4 = this.base64DecodeChars[str.charCodeAt(i++)];
            if (c4 == -1) break;

            out[j++] = String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out.join('');

    }

    toBinaryString(v, includeLength) {
        var length = v.length;
        var n = length << 2;
        if (includeLength) {
            var m = v[length - 1];
            n -= 4;
            if ((m < n - 3) || (m > n)) {
                return null;
            }
            n = m;
        }
        for (var i = 0; i < length; i++) {
            v[i] = String.fromCharCode(
                v[i] & 0xFF,
                v[i] >>> 8 & 0xFF,
                v[i] >>> 16 & 0xFF,
                v[i] >>> 24 & 0xFF
            );
        }
        var result = v.join('');
        if (includeLength) {
            return result.substring(0, n);
        }
        return result;
    }

    toUint32Array(bs, includeLength) {
        var length = bs.length;
        var n = length >> 2;
        if ((length & 3) !== 0) {
            ++n;
        }
        var v;
        if (includeLength) {
            v = new Array(n + 1);
            v[n] = length;
        }
        else {
            v = new Array(n);
        }
        for (var i = 0; i < length; ++i) {
            v[i >> 2] |= bs.charCodeAt(i) << ((i & 3) << 3);
        }
        return v;
    }

    int32(i) {
        return i & 0xFFFFFFFF;
    }

    mx(sum, y, z, p, e, k) {
        return ((z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4)) ^ ((sum ^ y) + (k[p & 3 ^ e] ^ z));
    }

    fixk(k) {
        if (k.length < 4) k.length = 4;
        return k;
    }

    encryptUint32Array(v, k) {
        var length = v.length;
        var n = length - 1;
        var y, z, sum, e, p, q;
        z = v[n];
        sum = 0;
        for (q = Math.floor(6 + 52 / length) | 0; q > 0; --q) {
            sum = this.int32(sum + this.DELTA);
            e = sum >>> 2 & 3;
            for (p = 0; p < n; ++p) {
                y = v[p + 1];
                z = v[p] = this.int32(v[p] + this.mx(sum, y, z, p, e, k));
            }
            y = v[0];
            z = v[n] = this.int32(v[n] + this.mx(sum, y, z, n, e, k));
        }
        return v;
    }

    decryptUint32Array(v, k) {
        var length = v.length;
        var n = length - 1;
        var y, z, sum, e, p, q;
        y = v[0];
        q = Math.floor(6 + 52 / length);
        for (sum = this.int32(q * this.DELTA); sum !== 0; sum = this.int32(sum - this.DELTA)) {
            e = sum >>> 2 & 3;
            for (p = n; p > 0; --p) {
                z = v[p - 1];
                y = v[p] = this.int32(v[p] - this.mx(sum, y, z, p, e, k));
            }
            z = v[n];
            y = v[0] = this.int32(v[0] - this.mx(sum, y, z, 0, e, k));
        }
        return v;
    }

    utf8Encode(str) {
        if (/^[\x00-\x7f]*$/.test(str)) {
            return str;
        }
        var buf: any[] = [];
        var n = str.length;
        for (var i = 0, j = 0; i < n; ++i, ++j) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit < 0x80) {
                buf[j] = str.charAt(i);
            }
            else if (codeUnit < 0x800) {
                buf[j] = String.fromCharCode(0xC0 | (codeUnit >> 6),
                    0x80 | (codeUnit & 0x3F));
            }
            else if (codeUnit < 0xD800 || codeUnit > 0xDFFF) {
                buf[j] = String.fromCharCode(0xE0 | (codeUnit >> 12),
                    0x80 | ((codeUnit >> 6) & 0x3F),
                    0x80 | (codeUnit & 0x3F));
            }
            else {
                if (i + 1 < n) {
                    var nextCodeUnit = str.charCodeAt(i + 1);
                    if (codeUnit < 0xDC00 && 0xDC00 <= nextCodeUnit && nextCodeUnit <= 0xDFFF) {
                        var rune = (((codeUnit & 0x03FF) << 10) | (nextCodeUnit & 0x03FF)) + 0x010000;
                        buf[j] = String.fromCharCode(0xF0 | ((rune >> 18) & 0x3F),
                            0x80 | ((rune >> 12) & 0x3F),
                            0x80 | ((rune >> 6) & 0x3F),
                            0x80 | (rune & 0x3F));
                        ++i;
                        continue;
                    }
                }
                throw new Error('Malformed string');
            }
        }
        return buf.join('');
    }

    utf8DecodeShortString(bs, n) {
        var charCodes = new Array(n);
        var i = 0, off = 0;
        for (var len = bs.length; i < n && off < len; i++) {
            var unit = bs.charCodeAt(off++);
            switch (unit >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    charCodes[i] = unit;
                    break;
                case 12:
                case 13:
                    if (off < len) {
                        charCodes[i] = ((unit & 0x1F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F);
                    }
                    else {
                        throw new Error('Unfinished UTF-8 octet sequence');
                    }
                    break;
                case 14:
                    if (off + 1 < len) {
                        charCodes[i] = ((unit & 0x0F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F);
                    }
                    else {
                        throw new Error('Unfinished UTF-8 octet sequence');
                    }
                    break;
                case 15:
                    if (off + 2 < len) {
                        var rune = (((unit & 0x07) << 18) |
                            ((bs.charCodeAt(off++) & 0x3F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)) - 0x10000;
                        if (0 <= rune && rune <= 0xFFFFF) {
                            charCodes[i++] = (((rune >> 10) & 0x03FF) | 0xD800);
                            charCodes[i] = ((rune & 0x03FF) | 0xDC00);
                        }
                        else {
                            throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                        }
                    }
                    else {
                        throw new Error('Unfinished UTF-8 octet sequence');
                    }
                    break;
                default:
                    throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
        }
        if (i < n) {
            charCodes.length = i;
        }
        return String.fromCharCode.apply(String, charCodes);
    }

    utf8DecodeLongString(bs, n) {
        var buf: any[] = [];
        var charCodes = new Array(0x8000);
        var i = 0, off = 0;
        for (var len = bs.length; i < n && off < len; i++) {
            var unit = bs.charCodeAt(off++);
            switch (unit >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    charCodes[i] = unit;
                    break;
                case 12:
                case 13:
                    if (off < len) {
                        charCodes[i] = ((unit & 0x1F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F);
                    }
                    else {
                        throw new Error('Unfinished UTF-8 octet sequence');
                    }
                    break;
                case 14:
                    if (off + 1 < len) {
                        charCodes[i] = ((unit & 0x0F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F);
                    }
                    else {
                        throw new Error('Unfinished UTF-8 octet sequence');
                    }
                    break;
                case 15:
                    if (off + 2 < len) {
                        var rune = (((unit & 0x07) << 18) |
                            ((bs.charCodeAt(off++) & 0x3F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)) - 0x10000;
                        if (0 <= rune && rune <= 0xFFFFF) {
                            charCodes[i++] = (((rune >> 10) & 0x03FF) | 0xD800);
                            charCodes[i] = ((rune & 0x03FF) | 0xDC00);
                        }
                        else {
                            throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                        }
                    }
                    else {
                        throw new Error('Unfinished UTF-8 octet sequence');
                    }
                    break;
                default:
                    throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
            if (i >= 0x7FFF - 1) {
                var size = i + 1;
                charCodes.length = size;
                buf[buf.length] = String.fromCharCode.apply(String, charCodes);
                n -= size;
                i = -1;
            }
        }
        if (i > 0) {
            charCodes.length = i;
            buf[buf.length] = String.fromCharCode.apply(String, charCodes);
        }
        return buf.join('');
    }

    // n is UTF16 length
    utf8Decode(bs, n?) {
        if (n === undefined || n === null || (n < 0)) n = bs.length;
        if (n === 0) return '';
        if (/^[\x00-\x7f]*$/.test(bs) || !(/^[\x00-\xff]*$/.test(bs))) {
            if (n === bs.length) return bs;
            return bs.substr(0, n);
        }
        return ((n < 0x7FFF) ?
            this.utf8DecodeShortString(bs, n) :
            this.utf8DecodeLongString(bs, n));
    }

    encrypt(data, key) {
        if (data === undefined || data === null || data.length === 0) {
            return data;
        }
        data = this.utf8Encode(data);
        key = this.utf8Encode(key);
        return this.toBinaryString(this.encryptUint32Array(this.toUint32Array(data, true), this.fixk(this.toUint32Array(key, false))), false);
    }

    encryptToBase64(data, key) {
        return this.btoa(this.encrypt(data, key));
    }

    decrypt(data, key) {
        if (data === undefined || data === null || data.length === 0) {
            return data;
        }
        key = this.utf8Encode(key);
        return this.utf8Decode(this.toBinaryString(this.decryptUint32Array(this.toUint32Array(data, false), this.fixk(this.toUint32Array(key, false))), true));
    }

    decryptFromBase64(data, key) {
        if (data === undefined || data === null || data.length === 0) {
            return data;
        }
        return this.decrypt(this.atob(data), key);
    }
}