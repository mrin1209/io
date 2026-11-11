import Color from "../../config/color.js";

export default class Heptagon {
    constructor(p) {
        this.p = p;

        this.color = Color.pink;
        this.radius = 35;
        this.size = this.radius * 2;

        this.armor = 200;
        this.power = 40;
        this.penetration = 80;
        this.recoil = 1.75;
    }

    draw() {
        const p = this.p;
        const r = this.radius;

        p.beginShape();

        for (let i = 0; i < 7; i++) {
            const angle = (Math.PI * 2 / 7) * i - Math.PI / 2;

            p.vertex(
                Math.cos(angle) * r,
                Math.sin(angle) * r
            );
        }

        p.endShape(p.CLOSE);
    }
}