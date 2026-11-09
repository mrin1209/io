import Color from "../../config/color.js";

export default class Circle {
    constructor(p) {
        this.p = p;

        this.color = Color.orange;
        this.radius = 10;
        this.size = this.radius * 2;
    }

    draw() {
        const p = this.p;

        p.circle(0, 0, this.radius * 2);
    }
}