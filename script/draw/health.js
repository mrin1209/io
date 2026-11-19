import Color from "../config/color.js"

export default class Health {
    constructor(p) {
        this.p = p;

        this.layout = {
            padding: 40,
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

        const max = tank.armor;
        const rate = Math.max(
            0,
            Math.min(1, tank.health / max)
        );

        p.push();
        p.resetMatrix();

        p.stroke(Color.level.stroke);
        p.strokeWeight(this.layout.strokeWeight);
        p.fill(Color.health.back);
        p.rect(
            (p.width - this.layout.width) / 2,
            this.layout.padding,
            this.layout.width,
            this.layout.height
        );

        p.fill(Color.health.fill);
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
            `${Math.round(tank.armor)} / ${Math.round(tank.health)}`,
            p.width / 2,
            this.layout.padding + this.layout.height / 2
        );

        p.pop();
    }
}