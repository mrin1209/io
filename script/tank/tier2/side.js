import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Side extends Tank {
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
        this.bullet.range = 140;
        this.bullet.radius = 10;

        this.upgrade = [
            'quad'
        ];

        this.next = 0;

        this.previewColor = Color.orange;

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

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        this.next = 1 - this.next;

        const aim = this.gun.aim / 2 * Math.PI / 180;
        const spread = this.p.random(-aim, aim);
        const angle = this.angle + spread + (this.next === 0 ? Math.PI : 0);

        const reverse = this.next === 0;
        const distance = this.gun.length * (reverse ? -1 : 1 );

        const x =
            this.x +
            Math.cos(this.angle) * distance;

        const y =
            this.y +
            Math.sin(this.angle) * distance;

        return this.add(x, y, angle);
    }
}