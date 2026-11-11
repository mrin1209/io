import Color from "../../config/color.js";

export default class Pentagon {
    constructor(p) {
        this.p = p;

        this.color = Color.blue;
        this.radius = 25;
        this.size = this.radius * 2;

        this.armor = 50;
        this.power = 25;
        this.penetration = 50;
        this.recoil = 1.45;
    }

    draw() {
        const p = this.p;
        const r = this.radius;

        p.beginShape();

        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;

            p.vertex(
                Math.cos(angle) * r,
                Math.sin(angle) * r
            );
        }

        p.endShape(p.CLOSE);
    }
}