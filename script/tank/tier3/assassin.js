import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Assassin extends Tank {
    constructor(param) {
        super(param);

        this.baseLength = 25;

        this.tank.zoom = 0.8;

        this.gun.reload = 120;
        this.gun.aim = 5;
        this.gun.recoil = 2;

        this.bullet.speed = 9;
        this.bullet.power = 30;
        this.bullet.armor = 10;
        this.bullet.penetration = 10;
        this.bullet.duration = 50;
        this.bullet.deceleration = 0.6;
        this.bullet.range = 67;
        this.bullet.radius = 10;

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
            -this.bullet.radius,
            this.gun.length,
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