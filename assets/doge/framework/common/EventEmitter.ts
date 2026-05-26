import { EventTarget } from "cc";

/**
 * 事件派发器列表
 */
export interface IEventTargets {
    [index: string]: EventTarget;
}

const EventEmitter: EventTarget = new EventTarget();
const EventEmitters: IEventTargets = {};

/**
 * 获取事件派发器
 * @param name 传入派发器名称则获取指定事件派发器，不传入则获取默认事件派发器
 */
export const getEventEmiter = (name: string = null): EventTarget => {
    if (name) {
        if (EventEmitters.hasOwnProperty(name)) {
            return EventEmitters[name]
        } else {
            let ne: EventTarget = new EventTarget();
            EventEmitters[name] = ne;
            return ne;
        }
    } else {
        return EventEmitter;
    }
};