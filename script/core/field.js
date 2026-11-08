import Color from "../config/color.js";
import Config from "../config/config.js";

export default class Field {
    constructor(p) {
        this.p = p;
    }

    run() {
        const p = this.p;

        this.p.background(Color.world.back);

        p.push();

        p.stroke(Color.world.border);
        p.strokeWeight(1);

        for (let x = 0; x <= Config.map.width; x += Config.view.grid) {
            p.line(x, 0, x, Config.map.height);
        }

        for (let y = 0; y <= Config.map.height; y += Config.view.grid) {
            p.line(0, y, Config.map.width, y);
        }

        p.pop();
    }
}