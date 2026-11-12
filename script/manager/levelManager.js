import Color from "../config/color.js"

export default class LevelManager {
    constructor(p) {
        this.p = p;

        this.layout = {
            padding: 10,
            width: 300,
            height: 20,
            textSize: 14,
            strokeWeight: 3,
        };
    }

    draw(target) {
        if (!target) return;
        const tank = target.get();

        const p = this.p;

        const rate = Math.max(
            0,
            Math.min(1, tank.exp / tank.requiredExp)
        );

        p.push();
        p.resetMatrix();

        p.stroke(Color.level.stroke);
        p.strokeWeight(this.layout.strokeWeight);
        p.fill(Color.level.back);
        p.rect(
            (p.width - this.layout.width) / 2,
            this.layout.padding,
            this.layout.width,
            this.layout.height
        );

        p.fill(Color.level.fill);
        p.rect(
            (p.width - this.layout.width) / 2,
            this.layout.padding,
            this.layout.width * rate,
            this.layout.height
        );

        p.stroke(Color.name.stroke);
        p.strokeWeight(this.layout.strokeWeight);
        p.fill(Color.name.color);
        p.textSize(this.layout.textSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(
            `Lv. ${tank.level}`,
            p.width / 2,
            this.layout.padding + this.layout.height / 2
        );

        p.pop();
    }
}