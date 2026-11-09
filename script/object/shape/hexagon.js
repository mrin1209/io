import Color from "../../config/color.js";

export default class Hexagon {
    constructor(p) {
        this.p = p;

        this.color = Color.purple;
        this.radius = 30;
        this.size = this.radius * 2;
    }

    draw() {
        const p = this.p;
        const r = this.radius;

        p.beginShape();

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;

            p.vertex(
                Math.cos(angle) * r,
                Math.sin(angle) * r
            );
        }

        p.endShape(p.CLOSE);
    }
}