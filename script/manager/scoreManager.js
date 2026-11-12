import Color from "../config/color.js";

export default class ScoreManager {
    constructor(p) {
        this.p = p;

        this.ranking = [];
        this.max = 10;

        this.layout = {
            padding: 10,
            height: 20,
            gap: 10,
            textSize: 14,
            strokeWeight: 3,
            size: 10,
        };
    }

    set(tanks) {
        const p = this.p;

        this.ranking = tanks
            .filter(item => item.tank.active)
            .sort((a, b) => b.tank.level - a.tank.level)
            .slice(0, this.max)
            .map((item, index) => {
                const preview = new item.tank.constructor({
                    p: this.p,
                    x: 0,
                    y: 0,
                    previewScale: this.layout.size / item.tank.get().radius,
                    level: item.tank.level,
                    name: item.tank.name,
                    type: item.tank.type,
                });

                const y = this.layout.padding + (this.layout.height / 2) + (index * (this.layout.height + this.layout.gap))

                preview.x = p.width - this.layout.padding - ((preview.baseRadius + preview.baseRadius) * (this.layout.size / preview.baseRadius));
                preview.y = y;

                return preview;
            });
    }

    draw() {
        const p = this.p;

        p.push();
        p.resetMatrix();

        this.ranking.forEach((tank, index) => {
            const y = this.layout.padding + (this.layout.height / 2) + (index * (this.layout.height + this.layout.gap))

            tank.draw();

            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(this.layout.textSize);
            p.stroke(Color.name.stroke);
            p.strokeWeight(this.layout.strokeWeight);
            p.fill(Color.name.color);
            p.text(
                `${tank.get().name} (${tank.get().level})`,
                p.width - this.layout.padding - ((tank.baseRadius * 2 + tank.baseRadius * 2) * (this.layout.size / tank.baseRadius)),
                y
            );
        });

        p.pop();
    }
}
