import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Crown extends Tank {
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
        this.bullet.range = 150;
        this.bullet.radius = 7.5;

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

        for (let i = 0; i < 8; i++) {
            p.push();
            p.rotate(Math.PI / 8 + (Math.PI * 2 / 8) * i);

            p.rect(
                0,
                -this.bullet.radius,
                this.gun.length - 2.5,
                this.bullet.radius * 2
            );

            p.pop();
        }

        for (let i = 0; i < 8; i++) {
            p.push();
            p.rotate((Math.PI * 2 / 8) * i);

            p.rect(
                0,
                -this.bullet.radius,
                this.gun.length,
                this.bullet.radius * 2
            );

            p.pop();
        }

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;
        const spread = this.p.random(-aim, aim);
        const angle = this.angle + spread;

        const length = this.gun.length;

        const offset = this.next === 0 ? 0 : Math.PI / 6;

        const bullets = [];

        for (let i = 0; i < 8; i++) {
            const direction = angle + offset + (Math.PI * 2 / 8) * i;

            const x = this.x + Math.cos(direction) * length;
            const y = this.y + Math.sin(direction) * length;

            bullets.push(this.add(x, y, direction));
        }

        this.next = 1 - this.next;

        return bullets;
    }
}