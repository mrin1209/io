import Color from "../config/color.js"

export default class LevelManager {
    constructor(p) {
        this.p = p;

        this.width = 300;
        this.height = 24;
        this.y = 20;
    }

    draw(target) {
        if (!target) return;
        const tank = target.get();

        const p = this.p;

        const requiredExp = tank.requiredExp;
        const currentExp = tank.exp;

        const rate = Math.max(
            0,
            Math.min(1, currentExp / requiredExp)
        );

        const x = (p.width - this.width) / 2;

        p.push();
        p.resetMatrix();

        p.noStroke();
        p.fill(Color.level.back);
        p.rect(x, this.y, this.width, this.height, 6);

        p.fill(Color.level.fill);
        p.rect(
            x,
            this.y,
            this.width * rate,
            this.height,
            6
        );

        p.stroke(Color.name.stroke);
        p.strokeWeight(3);
        p.fill(Color.name.color);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(
            `LEVEL ${tank.level}`,
            p.width / 2,
            this.y + this.height / 2
        );

        p.pop();
    }
}