import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Triple extends Tank {
    constructor(param) {
        super(param);

        this.gun.reload = 22.5;
        this.gun.aim = 10;
        this.gun.radius = (this.bullet.radius * 3) - 12;
        this.gun.count = 1.5;
        this.gun.recoil = 0.25;

        this.bullet.speed = 3;
        this.bullet.power = 5;
        this.bullet.armor = 5;
        this.bullet.penetration = 5;
        this.bullet.duration = 30;
        this.bullet.deceleration = 0.01;
        this.bullet.range = 145;
        this.bullet.radius = 7.5;
        this.next = 0;

        this.previewColor = Color.blue;

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
            this.bullet.radius - 3,
            this.gun.length,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.baseRadius - this.bullet.radius + 3,
            this.gun.length,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.bullet.radius,
            this.gun.length + 10,
            this.bullet.radius * 2
        );

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;

        const bullets = [];

        if (this.next === 0) {
            const angle = this.angle + this.p.random(-aim, aim);

            const x = this.x + Math.cos(this.angle) * this.gun.length;
            const y = this.y + Math.sin(this.angle) * this.gun.length;

            bullets.push(this.add(x, y, angle));

        } else {
            const offsets = [
                -this.bullet.radius - 2,
                this.bullet.radius + 2
            ];

            for (const offset of offsets) {
                const spread = this.p.random(-aim, aim);
                const angle = this.angle + spread;

                const x =
                    this.x +
                    Math.cos(this.angle) * this.gun.length +
                    Math.cos(this.angle + Math.PI / 2) * offset;

                const y =
                    this.y +
                    Math.sin(this.angle) * this.gun.length +
                    Math.sin(this.angle + Math.PI / 2) * offset;

                bullets.push(this.add(x, y, angle));
            }
        }

        this.next = 1 - this.next;

        return bullets;
    }
}