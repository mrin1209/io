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

    pressed(x, y) {
        const p = this.p;

        for (let i = 0; i < this.ranking.length; i++) {
            const tank = this.ranking[i];

            const itemY = this.layout.padding + i * (this.layout.height + this.layout.gap);

            const right = p.width - this.layout.padding;
            const left = right - ((tank.baseRadius * 4) * (this.layout.size / tank.baseRadius));

            if (
                x >= left &&
                x <= right &&
                y >= itemY &&
                y <= itemY + this.layout.height
            ) {
                return tank.get().id;
            }
        }

        return null;
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
                    level: item.tank.get().level,
                    id: item.tank.get().id,
                    name: item.tank.get().name,
                    type: item.tank.get().type,
                });

                const y = this.layout.padding + (this.layout.height / 2) + (index * (this.layout.height + this.layout.gap))
                const x = p.width - this.layout.padding - ((preview.baseRadius * 2) * (this.layout.size / preview.baseRadius));

                preview.x = x;
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
            const x = p.width - this.layout.padding - ((tank.baseRadius * 4) * (this.layout.size / tank.baseRadius));
            tank.draw();

            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(this.layout.textSize);
            p.stroke(Color.name.stroke);
            p.strokeWeight(this.layout.strokeWeight);
            p.fill(Color.name.color);
            p.text(
                `${tank.get().name} (${tank.get().level})`,
                x,
                y
            );
        });

        p.pop();
    }
}
