

export default class FloatCalc {
    /**
     * 解决两个数相加精度丢失问题
     * @param a
     * @param b
     * @returns {Number}
     */
    public static add(a: number, b: number): number {
        var c: number, d: number, e: number;
        if (undefined == a || null == a || isNaN(a)) { a = 0; }
        if (undefined == b || null == b || isNaN(b)) { b = 0; }
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        e = Math.pow(10, Math.max(c, d));
        return (FloatCalc.mul(a, e) + FloatCalc.mul(b, e)) / e;
    }
    /**
     * 解决两个数相减精度丢失问题
     * @param a
     * @param b
     * @returns {Number}
     */
    public static sub(a: number, b: number): number {
        var c: number, d: number, e: number;
        if (undefined == a || null == a || isNaN(a)) { a = 0; }
        if (undefined == b || null == b || isNaN(b)) { b = 0; }
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        e = Math.pow(10, Math.max(c, d));
        return (FloatCalc.mul(a, e) - FloatCalc.mul(b, e)) / e;
    }
    /**
     * 解决两个数相乘精度丢失问题
     * @param a
     * @param b
     * @returns {Number}
     */
    public static mul(a: number, b: number): number {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) { }
        try {
            c += e.split(".")[1].length;
        } catch (f) { }
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }
    /**
     * 解决两个数相除精度丢失问题
     * @param a
     * @param b
     * @returns
     */
    public static div(a: number, b: number): number {
        var c: number, d: number, e: number = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) { }
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) { }
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), FloatCalc.mul(c / d, Math.pow(10, f - e));
    }
}
