import Crypto from "../common/Crypto";
import { MockHelper } from "./MockHelper";


type NetCallback = (isSucess: boolean, res: string, helper: HttpHelper) => void;

export default class HttpHelper {
    public static token: string = null;
    public static xBundle: string = null;

    private url: string = "";
    private netCallback: NetCallback = null;

    constructor() {

    }

    public post(url: string, body: string, callback: NetCallback, timeOut?: number) {
        this.url = url;
        this.netCallback = callback;
        let xhr = new XMLHttpRequest();
        if (timeOut) {
            xhr.timeout = timeOut;
        }

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Accept", "text/html");
        xhr.setRequestHeader("Accept", "text/json");
        xhr.setRequestHeader("Accept", "text/javascript");
        xhr.setRequestHeader("Accept", "text/plain");
        xhr.setRequestHeader("X-Bundle", HttpHelper.xBundle);
        // xhr.setRequestHeader("token", HttpHelper.token);

        xhr.onreadystatechange = () => {

            if (xhr.readyState === 4) {

                let response = xhr.responseText;

                console.log(`xhrUrl:${url} xhr.status: ${xhr.status} | response: ${response} `);

                if (xhr.status >= 200 && xhr.status < 300) {
                    if (this.netCallback) {
                        this.clearNetCallback()(true, response, this);
                    }
                } else {
                    if (this.netCallback) {
                        this.clearNetCallback()(false, response, this);
                    }
                }

            }
        };

        xhr.ontimeout = (e) => {
            console.log(`xhr.status: timeout ${xhr.responseText}`);
            if (this.netCallback) {
                this.clearNetCallback()(false, "timeout", this);
            }
        }

        xhr.onerror = (e) => {
            console.log(`xhr.status: error  ${xhr.responseText}`);
            if (this.netCallback) {
                this.clearNetCallback()(false, "error", this);
            }
        }

        xhr.responseType = "text";
        xhr.send(body);
    }

    public get(url: string, params: Object = {}, callback: NetCallback, timeOut?: number) {
        this.url = url;
        this.netCallback = callback;

        let urlParams: string = "";
        Object.keys(params).forEach(key => {
            urlParams += key + "=" + encodeURIComponent(params[key]) + "&";
        })
        if (urlParams !== "") {
            urlParams = urlParams.substring(0, urlParams.lastIndexOf("&"));
            url = url + '?' + urlParams;
        }

        let xhr = new XMLHttpRequest();
        if (timeOut) {
            xhr.timeout = timeOut;
        }

        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        xhr.onreadystatechange = () => {

            if (xhr.readyState === 4) {

                let response = xhr.responseText;

                console.log(`xhrUrl:${url} xhr.status: ${xhr.status} | response: ${response} `);

                if (xhr.status >= 200 && xhr.status < 300) {
                    if (this.netCallback) {
                        this.clearNetCallback()(true, JSON.parse(response), this);
                    }
                } else {
                    if (this.netCallback) {
                        this.clearNetCallback()(false, response, this);
                    }
                }

            }

        };

        xhr.ontimeout = (e) => {
            console.log(`xhr.status: timeout ${xhr.responseText}`);
            if (this.netCallback) {
                this.clearNetCallback()(false, "timeout", this);
            }
        }

        xhr.onerror = (e) => {
            console.log(`xhr.status: error  ${xhr.responseText}`);
            if (this.netCallback) {
                this.clearNetCallback()(false, "error", this);
            }
        }

        xhr.send();
    }

    private clearNetCallback(): NetCallback {
        let cb = this.netCallback;
        this.netCallback = null;
        return cb;
    }

    public getUrl(): string {
        return this.url;
    }

    public static get(url: string, params: Object = {}, callback: NetCallback, timeOut?: number) {
        let mockData = MockHelper.mock(url);
        if (mockData) {
            callback && callback(true, mockData, new HttpHelper());
        } else {
            new HttpHelper().get(url, params, callback, timeOut);
        }
    }

    //Post请求
    public static post(url: string, body: string, callback: NetCallback, timeOut?: number) {
        let mockData = MockHelper.mock(url);
        if (mockData) {
            callback && callback(true, mockData, new HttpHelper());
        } else {
            new HttpHelper().post(url, body, callback, timeOut);
        }
    }

    public static signCBC(bodyObj: any): string {
        let bodyJsonStr = JSON.stringify(bodyObj);
        console.log("signature str", bodyJsonStr);
        let signObj = {
            sign: Crypto.encryptCBC(bodyJsonStr)
        }
        console.log("signature obj", signObj);
        return JSON.stringify(signObj);
    }

    public static unSignCBC(data: string): any {
        return Crypto.decryptCBC(data);
    }

    public static signXXTea(bodyObj: any): string {
        let bodyJsonStr = JSON.stringify(bodyObj);
        console.log("signature str", bodyJsonStr);
        let signObj = {
            sign: Crypto.encryptXXTEA(bodyJsonStr)
        }
        console.log("signature obj", signObj);
        return JSON.stringify(signObj);
    }

    public static unSignXXTea(data: string): any {
        return Crypto.decryptXXTEA(data);
    }
}

