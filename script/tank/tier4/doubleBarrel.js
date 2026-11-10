import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class DoubleBarrel extends Tank {
    constructor(param) {
        super(param);

        this.gun.reload = 120;
        this.gun.aim = 20;
        this.gun.count = 10;
        this.gun.recoil = 3;

        this.bullet.speed = 3;
        this.bullet.power = 5;
        this.bullet.armor = 10;
        this.bullet.penetration = 10;
        this.bullet.duration = 30;
        this.bullet.deceleration = 0.01;
        this.bullet.range = 145;
        this.bullet.radius = 7.5;

        this.next = 0;

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

        const aim = this.gun.aim / 2 * Math.PI / 180;
        const spread = Math.tan(aim) * this.gun.length / 2;

        p.rectMode(p.CORNER);

        p.stroke(Color.gun.border);
        p.strokeWeight(2);
        p.fill(Color.gun.fill);

        p.rect(
            0,
            2,
            this.gun.length / 2 + this.tank.radius / 2,
            this.bullet.radius * 2
        );

        p.rect(
            0,
            -this.baseRadius - 2,
            this.gun.length / 2 + this.tank.radius / 2,
            this.bullet.radius * 2
        );

        p.beginShape();
        p.vertex(this.gun.length / 2 + this.tank.radius / 2, -this.baseRadius - 2);
        p.vertex(this.gun.length, -this.baseRadius - 2 - spread);
        p.vertex(this.gun.length, -this.baseRadius + this.bullet.radius * 2 - 2 + spread);
        p.vertex(this.gun.length / 2 + this.tank.radius / 2, -this.baseRadius + this.bullet.radius * 2 - 2);
        p.endShape(p.CLOSE);

        p.beginShape();
        p.vertex(this.gun.length / 2 + this.tank.radius / 2, 2);
        p.vertex(this.gun.length, 2 - spread);
        p.vertex(this.gun.length, 2 + this.bullet.radius * 2 + spread);
        p.vertex(this.gun.length / 2 + this.tank.radius / 2, 2 + this.bullet.radius * 2);
        p.endShape(p.CLOSE);

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;

        const bullets = [];

        for (let i = 0; i < this.gun.count; i++) {
            this.next = 1 - this.next;

            const offset = this.next === 0
                ? -this.bullet.radius - 2
                : this.bullet.radius + 2;

            const x = this.x
                + Math.cos(this.angle) * this.gun.length
                + Math.cos(this.angle + Math.PI / 2) * offset;

            const y = this.y
                + Math.sin(this.angle) * this.gun.length
                + Math.sin(this.angle + Math.PI / 2) * offset;

            const spread = this.p.random(-aim, aim);
            const angle = this.angle + spread;

            const bullet = this.add(x, y, angle);

            if (!bullet) continue;

            bullet.config.speed = this.p.random(
                this.bullet.speed * 0.75,
                this.bullet.speed
            );

            bullet.config.range = this.p.random(
                this.bullet.range * 0.75,
                this.bullet.range
            );

            bullet.config.deceleration = this.p.random(
                this.bullet.deceleration,
                this.bullet.deceleration * 2
            );

            bullet.config.duration = this.p.random(
                this.bullet.duration * 0.75,
                this.bullet.duration
            );

            bullets.push(bullet);
        }

        return bullets;
    }
}