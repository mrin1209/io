import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Quad extends Tank {
    constructor(param) {
        super(param);

        this.gun.reload = 30;
        this.gun.aim = 10;
        this.gun.recoil = 0;

        this.bullet.speed = 3;
        this.bullet.power = 10;
        this.bullet.armor = 10;
        this.bullet.penetration = 10;
        this.bullet.duration = 30;
        this.bullet.deceleration = 0.01;
        this.bullet.range = 145;
        this.bullet.radius = 10;

        this.next = 0;

        this.previewColor = Color.red;

        super.setup(param);
    }

    draw() {
        const p = this.p;

        p.push();

        p.translate(this.x, this.y);
        p.rotate(this.angle);
        p.scale(this.previewScale);

        p.rectMode(p.CORNER);

        p.stroke(Color.gun.border);
        p.strokeWeight(2);

        p.fill(Color.gun.fill);

        p.rect(
            0,
            -this.bullet.radius,
            this.gun.length,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.bullet.radius,
            -this.gun.length,
            this.bullet.radius * 2
        );
        p.rect(
            -this.bullet.radius,
            0,
            this.bullet.radius * 2,
            this.gun.length,
        );
        p.rect(
            -this.bullet.radius,
            0,
            this.bullet.radius * 2,
            -this.gun.length,
        );

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;
        const spread = this.p.random(-aim, aim);
        const angle = this.angle + spread;
        
        const length = this.gun.length;

        const directions = this.next === 0
            ? [
                angle - Math.PI / 2, // 上
                angle + Math.PI / 2  // 下
            ]
            : [
                angle,               // 右
                angle + Math.PI      // 左
            ];

        this.next = 1 - this.next;

        const bullets = [];

        for (const direction of directions) {
            const x = this.x + Math.cos(direction) * length;
            const y = this.y + Math.sin(direction) * length;

            bullets.push(this.add(x, y, direction));
        }

        return bullets;
    }
}