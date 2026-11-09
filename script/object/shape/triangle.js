import Color from "../../config/color.js";

export default class Triangle {
    constructor(p) {
        this.p = p;

        this.color = Color.yellow;
        this.radius = 15;
        this.size = this.radius * 2;
    }

    draw() {
        const p = this.p;
        const r = this.radius;

        p.triangle(
            0, -r,
            -r * Math.sqrt(3) / 2, r / 2,
            r * Math.sqrt(3) / 2, r / 2
        );
    }
}