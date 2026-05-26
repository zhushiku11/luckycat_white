import { Node, UIOpacity, UITransform, view, tween, Color, TransformBit, Material, builtinResMgr, UIRenderer, Vec3, Vec2, v3, v2, EventTouch } from 'cc';
import { EDITOR } from 'cc/env';

if (!EDITOR) {

   Object.defineProperty(Node.prototype, 'x', {
       get() { return this.position.x; },
       set(v: number) { this.setPosition(v, this.y, this.z); }
   });
   Object.defineProperty(Node.prototype, 'y', {
       get() { return this.position.y; },
       set(v: number) { this.setPosition(this.x, v, this.z); }
   });
   Object.defineProperty(Node.prototype, 'z', {
       get() { return this.position.z; },
       set(v: number) { this.setPosition(this.x, this.y, v); }
   });

   Object.defineProperty(Node.prototype, 'widths', {
       get() {
           let uitr: UITransform = this.getComponent(UITransform);
           if (!uitr) { uitr = this.addComponent(UITransform); }
           return uitr.width;
       },
       set(v: number) {
           let uitr: UITransform = this.getComponent(UITransform);
           if (!uitr) { uitr = this.addComponent(UITransform); }
           uitr.width = v;
       }
   });
   Object.defineProperty(Node.prototype, 'heights', {
       get() {
           let uitr: UITransform = this.getComponent(UITransform);
           if (!uitr) { uitr = this.addComponent(UITransform); }
           return uitr.height;
       },
       set(v: number) {
           let uitr: UITransform = this.getComponent(UITransform);
           if (!uitr) { uitr = this.addComponent(UITransform); }
           uitr.height = v;
       }
   });
   Object.defineProperty(Node.prototype, 'transform', {
       get() {
           let uitr: UITransform = this.getComponent(UITransform);
           if (!uitr) { uitr = this.addComponent(UITransform); }
           return uitr;
       },
   });

   Object.defineProperty(Node.prototype, 'scales', {
       get() { return this.scale.x; },
       set(v: number) { this.setScale(v, v, v); }
   });

   Object.defineProperty(Node.prototype, 'alpha', {
       get() {
           let uiop: UIOpacity = this.getComponent(UIOpacity);
           if (!uiop) { uiop = this.addComponent(UIOpacity); }
           return uiop.opacity;
       },
       set(v: number) {
           let uiop: UIOpacity = this.getComponent(UIOpacity);
           if (!uiop) { uiop = this.addComponent(UIOpacity); }
           uiop.opacity = v;
       }
   });
   Object.defineProperty(Node.prototype, 'opacity', {
       get() {
           let uiop: UIOpacity = this.getComponent(UIOpacity);
           if (!uiop) { uiop = this.addComponent(UIOpacity); }
           return uiop;
       },
   });

   Node.prototype.fadeIn = function (time = 0.2, alpha = 255, cb?) {
       tween(this).to(time, { alpha: alpha }).call(() => { cb?.() }).start();
   };
   Node.prototype.fadeOut = function (time = 0.2, alpha = 0, cb?) {
       tween(this).to(time, { alpha: alpha }).call(() => { cb?.() }).start();
   };

   Node.prototype.scaleTo = function (time = 0.2, scale = 1, cb?) {
       tween(this).to(time, { scales: scale }).call(() => { cb?.() }).start();
   };

   Node.prototype.getPath = function () {
       let node = this, str = node.name;
       while (node.parent) {
           node = node.parent;
           str = `${node.name}/${str}`;
       }
       return str;
   };
   Node.prototype.getPoint = function () {
       const winSize = view.getVisibleSize();
       const point = this.worldPosition.clone();
       point.subtract3f(winSize.width / 2, winSize.height / 2, 0);
       return point;
   };

   Node.prototype.setGray = function (isGray: boolean) {
       const material: Material = builtinResMgr.get(isGray ? "ui-sprite-gray-material" : "");
       const renders = this.getComponentsInChildren(UIRenderer);
       for (let i = 0; i < renders.length; i++) {
           renders[i].customMaterial = material;
       }
   };


   // Vec2.prototype.toVec3 = function (): Vec3 {
   //     return v3(this.x, this.y);
   // }
   // Vec2.prototype.toAngle = function (): number {
   //     return Math.atan2(this.y, this.x) * 180 / Math.PI;
   // }

   // Vec3.prototype.toVec2 = function (): Vec2 {
   //     return v2(this.x, this.y);
   // }
   // Vec3.prototype.toAngle = function (): number {
   //     return Math.atan2(this.y, this.x) * 180 / Math.PI;
   // }

   // EventTouch.prototype.toVec2 = function (): Vec2 {
   //     const winSize = view.getVisibleSize();
   //     const point = this.getUILocation()
   //     point.subtract2f(winSize.width / 2, winSize.height / 2);
   //     return point;
   // }

}