

export class Clock {

    private static timeDifference: number = 0;
    private static timing: Map<string, number> = new Map<string, number>();

    /**
     * 同步服务器时间 消除与服务器时间差
     *
     * @static
     * @param {number} serverTime 服务器时间
     * @memberof Clock
     */
    public static syncTime(serverTime: number): void {
        this.timeDifference = serverTime - new Date().getTime();
    }

    /**
     * 新建一个时间 已与服务器时间同步
     *
     * @static
     * @return {*} 
     * @memberof Clock
     */
    public static new(): Date {
        let date = new Date();
        date.setTime(date.getTime() + this.timeDifference);
        return date;
    }

    /**
     * 获取当前时间
     *
     * @static
     * @return {*}  {string} yyyy-mm-dd
     * @memberof Clock
     */
    public static text(date: Date, symbol: string = "-"): string {
        var yy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        return `${yy}${symbol}${mm}${symbol}${dd}`;
    }

    /**
     * 获取偏移后的日期（偏移单位：ms）
     *
     * @static
     * @param {Date} date
     * @param {number} ms
     * @return {*} 
     * @memberof Clock
     */
    public static offset(date: Date, ms: number): Date {
        date.setTime(date.getTime() + ms);
        return date;
    }

    /**
     * 当前时间归0
     *
     * @static
     * @param {Date} date
     * @return {*}  {Date}
     * @memberof Clock
     */
    public static zero(date: Date = new Date()): Date {
        date.setHours(0, 0, 0, 0);
        return date;
    }

    /**
     * 当前日期最后一刻
     * @returns String
     */
    public static last(date: Date, isSecond: boolean = true): Date {
        if (isSecond) {
            date.setHours(23, 59, 59, 0);
        } else {
            date.setHours(23, 59, 59, 999);
        }
        return date;
    }

    /**
     * 当前时间下一日
     *
     * @static
     * @param {Date} [date=new Date()]
     * @return {*}  {Date}
     * @memberof Clock
     */
    public static tomorrow(date: Date = new Date()): Date {
        return this.offset(date, 86400000);
    }

    /**
     * 当前时间下一日归0
     *
     * @static
     * @param {Date} [date=new Date()]
     * @return {*}  {Date}
     * @memberof Clock
     */
    public static tomorrowZero(date: Date = new Date()): Date {
        return this.zero(this.tomorrow(date));
    }

    /**
     * 获取当前月份
     *
     * @static
     * @return {*}  {number}
     * @memberof Clock
     */
    public static getCurrMonth(): number {
        var myDate = new Date();
        return myDate.getMonth() + 1;
    }

    /**
     * 获取月份对应的天数
     *
     * @static
     * @param {number} month 月份
     * @return {*}  {number} 天数
     * @memberof Clock
     */
    public static getDaysByMonth(month: number): number {
        var newDate = new Date();
        var years = newDate.getFullYear();
        var days = 0;
        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            return days = 31;
        } else if (month == 2) {
            if (years % 4 == 0 && years % 100 != 0 || years % 400 == 0) {
                return days = 29;
            }
            else {
                return days = 28;
            }
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            return days = 30;
        }
        return days;
    }

    /**
     * 获取当前月份对应天数
     *
     * @static
     * @return {*}  {number} 天数
     * @memberof Clock
     */
    public static getCurrMonthDays(): number {
        return this.getDaysByMonth(this.getCurrMonth());
    }

    /**
     * 格式化时间
     *
     * @static
     * @param {Date} date 
     * @param {string} [fmt="yyyy-MM-dd hh:mm:ss.S"]
     * @return {*}  {string}
     * @memberof Clock
     */
    public static format(date: Date, fmt: string = "yyyy-MM-dd hh:mm:ss.S"): string {
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        const re = /(y+)/;
        if (re.test(fmt)) { const t = re.exec(fmt)[1]; fmt = fmt.replace(t, (date.getFullYear() + "").substring(4 - t.length)); }
        for (var k in o) {
            const regx = new RegExp("(" + k + ")");
            if (regx.test(fmt)) { const t = regx.exec(fmt)[1]; fmt = fmt.replace(t, (t.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length))); }
        }
        return fmt;
    }

    /**
     * 获取时钟
     *
     * @static
     * @param {*} time
     * @param {string} [fmt="hh:mm:ss"]
     * @return {*} 
     * @memberof Clock
     */
    public static getClock(sec: number, fmt: string = "hh:mm:ss"): string {
        var seconds = sec % 60;
        var minutes = Math.floor(sec / 60) % 60;
        var hours = Math.floor(sec / 3600) % 24;
        var day = Math.floor(sec / 86400);

        var o = {
            "d+": day, //日 
            "h+": hours, //小时 
            "m+": minutes, //分 
            "s+": seconds, //秒
        };

        for (var k in o) {
            const regx = new RegExp("(" + k + ")");
            if (regx.test(fmt)) { const t = regx.exec(fmt)[1]; fmt = fmt.replace(t, (t.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length))); }
        }

        return fmt;
    }

    /**
     * 定时
     *
     * @static
     * @param {string} key 键值 停止定时时使用
     * @param {Function} callback
     * @memberof Clock
     */
    public static time(key: string, date: Date, callback: Function) {
        let duration = date.getTime() - new Date().getTime();
        if (duration > 0) {
            this.timing.set(key, setTimeout(() => {
                this.timing.delete(key);
                callback();
            }, duration));
        }
    }

    /**
     * 取消定时
     *
     * @static
     * @param {string} key
     * @memberof Clock
     */
    public static unTime(key: string) {
        clearTimeout(this.timing.get(key));
        this.timing.delete(key);
    }
}
