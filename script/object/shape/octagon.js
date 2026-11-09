import Color from "../../config/color.js";

export default class Octagon {
    constructor(p) {
        this.p = p;

        this.color = Color.red;
        this.radius = 40;
        this.size = this.radius * 2;
    }

    draw() {
        const p = this.p;
        const r = this.radius;

        p.beginShape();

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;

            p.vertex(
                Math.cos(angle) * r,
                Math.sin(angle) * r
            );
        }

        p.endShape(p.CLOSE);
    }
}