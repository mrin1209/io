import Color from "../../config/color.js";

export default class Square {
    constructor(p) {
        this.p = p;

        this.color = Color.green;
        this.radius = 20;
        this.size = this.radius * Math.sqrt(2);

        this.armor = 40;
        this.power = 20;
        this.penetration = 20;
        this.recoil = 1.3;
    }

    draw() {
        const p = this.p;
        const size = this.size;

        p.rect(0, 0, size, size);
    }
}