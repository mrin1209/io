import Color from "../config/color.js"

export default class Name {
    constructor(p) {
        this.p = p;

        this.layout = {
            padding: 70,
            height: 20,
            textSize: 14,
            strokeWeight: 3,
        };
    }

    draw(target) {
        if (!target) return;
        const tank = target.get();

        const p = this.p;

        p.push();
        p.resetMatrix();

        p.stroke(Color.name.stroke);
        p.strokeWeight(this.layout.strokeWeight);
        p.fill(Color.name.color);
        p.textSize(this.layout.textSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.textStyle(p.BOLD);
        p.text(
            `${tank.name}`,
            p.width / 2,
            p.height - this.layout.padding - this.layout.height / 2,
        );

        p.pop();
    }
}