import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Converge extends Tank {
    constructor(param) {
        super(param);

        this.gun.reload = 10;
        this.gun.aim = 10;
        this.gun.radius = (this.bullet.radius * 3) - 12;
        this.gun.count = 1.6667;
        this.gun.recoil = 0.1;

        this.bullet.speed = 3;
        this.bullet.power = 3;
        this.bullet.armor = 3;
        this.bullet.penetration = 3;
        this.bullet.duration = 30;
        this.bullet.deceleration = 0.01;
        this.bullet.range = 155;
        this.bullet.radius = 7;

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
            this.bullet.radius * 2 - 6,
            this.gun.length,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.baseRadius - this.bullet.radius * 2 + 6,
            this.gun.length ,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            this.bullet.radius - 6,
            this.gun.length + 5,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.baseRadius - this.bullet.radius + 6,
            this.gun.length + 5,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.bullet.radius,
            this.gun.length + 10,
            this.bullet.radius * 2
        );

        p.rect(
            0,
            this.bullet.radius * 2 - 3.5,
            this.gun.length - 10,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.baseRadius - this.bullet.radius * 2 + 4.5,
            this.gun.length - 10,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            this.bullet.radius - 4,
            this.gun.length + 5 - 10,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.baseRadius - this.bullet.radius + 4,
            this.gun.length + 5 - 10,
            this.bullet.radius * 2
        );
        p.rect(
            0,
            -this.bullet.radius,
            this.gun.length + 10 - 10,
            this.bullet.radius * 2
        );


        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;
        const bullets = [];

        const offsets = [
            [0],
            [
                -this.bullet.radius - 2,
                this.bullet.radius + 2
            ],
            [
                -this.baseRadius - this.bullet.radius + 3,
                this.baseRadius + this.bullet.radius - 3
            ],
            [
                -this.bullet.radius - 2,
                this.bullet.radius + 2
            ],
        ];

        for (const offset of offsets[this.next]) {
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

        this.next = (this.next + 1) % 4;

        return bullets;
    }
}