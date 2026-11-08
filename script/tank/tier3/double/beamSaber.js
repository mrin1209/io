import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class BeamSaber extends Tank {
    constructor(param) {
        super(param);

        this.gun.reload = 1;
        this.gun.aim = 0;
        this.gun.recoil = 0;

        this.bullet.speed = 22;
        this.bullet.power = 0.3333;
        this.bullet.armor = 1;
        this.bullet.penetration = 0.3333;
        this.bullet.duration = 0;
        this.bullet.deceleration = 0;
        this.bullet.range = 11;
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

        p.fill(Color.gun.fill);
        p.rect(
            0,
            -this.bullet.radius / 2,
            this.gun.length,
            this.bullet.radius
        );
        p.rect(
            this.tank.radius,
            -this.bullet.radius,
            this.bullet.radius / 2,
            this.bullet.radius * 2
        );

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        if (!super.shot()) return;

        const aim = this.gun.aim / 2 * Math.PI / 180;
        const spread = this.p.random(-aim, aim);
        const angle = this.angle + spread;

        const x = this.x + Math.cos(this.angle) * this.gun.length;
        const y = this.y + Math.sin(this.angle) * this.gun.length;

        return this.add(x, y, angle);
    }
}