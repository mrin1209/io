import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Wide extends Tank {
    constructor(param) {
        super(param);

        this.gun.reload = 30;
        this.gun.aim = 25;
        this.gun.recoil = 1.5;

        this.bullet.speed = 3;
        this.bullet.power = 12.5;
        this.bullet.armor = 10;
        this.bullet.penetration = 10;
        this.bullet.duration = 30;
        this.bullet.deceleration = 0.01;
        this.bullet.range = 140;
        this.bullet.radius = 10;

        this.previewColor = Color.yellow;

        super.setup(param);
    }

    draw() {
        const p = this.p;

        p.push();

        p.translate(this.x, this.y);
        p.rotate(this.angle);
        p.scale(this.previewScale);

        const muzzle = this.gun.length * Math.tan(this.gun.aim * Math.PI / 180);

        p.rectMode(p.CORNER);

        p.stroke(Color.gun.border);
        p.strokeWeight(2);

        p.fill(Color.gun.fill);
        p.beginShape();
        p.vertex(0, -this.bullet.radius * 0.5);
        p.vertex(this.gun.length, -muzzle);
        p.vertex(this.gun.length, muzzle);
        p.vertex(0, this.bullet.radius * 0.5);
        p.endShape(p.CLOSE);

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