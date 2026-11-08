import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class ShotRifle extends Tank {
    constructor(param) {
        super(param);

        this.baseLength = 20;
        this.tank.zoom = 0.8;

        this.gun.reload = 120;
        this.gun.aim = 5;
        this.gun.count = 3;
        this.gun.recoil = 2;

        this.bullet.speed = 9;
        this.bullet.power = 20;
        this.bullet.armor = 10;
        this.bullet.penetration = 10;
        this.bullet.duration = 50;
        this.bullet.deceleration = 0.6;
        this.bullet.range = 67;
        this.bullet.radius = 10;

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
            -this.bullet.radius,
            this.gun.length / 2 + this.tank.radius / 2,
            this.bullet.radius * 2
        );

        p.beginShape();
        p.vertex(this.gun.length / 2 + this.tank.radius / 2, -this.bullet.radius);
        p.vertex(this.gun.length, -this.bullet.radius - spread);
        p.vertex(this.gun.length, this.bullet.radius + spread);
        p.vertex(this.gun.length / 2 + this.tank.radius / 2, this.bullet.radius);
        p.endShape(p.CLOSE);

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;

        const x = this.x + Math.cos(this.angle) * this.gun.length;
        const y = this.y + Math.sin(this.angle) * this.gun.length;

        const bullets = [];

        for (let i = 0; i < this.gun.count; i++) {
            const spread = this.p.random(-aim, aim);
            const angle = this.angle + spread;

            const bullet = this.add(x, y, angle);

            if (!bullet) continue;

            bullet.config.speed = this.p.random(
                this.bullet.speed,
                this.bullet.speed + 1
            );

            bullet.config.range = this.p.random(
                this.bullet.range - 5,
                this.bullet.range + 5
            );

            bullets.push(bullet);
        }

        return bullets;
    }
}