import Tanks from "../config/tanks.js";
import Color from "../config/color.js";

export default class UpgradeManager {
    constructor(p) {
        this.p = p;

        this.tanks = [];

        this.layout = {
            padding: 10,
            width: 80,
            height: 80,
            gap: 10,
            textSize: 10,
            strokeWeight: 3,
            size: 15,
        };
    }

    set(tank) {
        const p = this.p;

        const tanks = Object.entries(Tanks[`tier${tank.get().tier + 1}`]?.[tank.get().tank] ?? []);
        const total = tanks.length * (this.layout.width + this.layout.gap) - this.layout.gap;

        this.tanks = tanks.map(([key, value], index) => {
            const x = ((p.width - total) / 2) + (index * (this.layout.width + this.layout.gap)) + (this.layout.width / 2);
            const y = this.layout.padding + (this.layout.height / 2);

            const preview = new value({
                p: this.p,
                x: x,
                y: y,
                previewScale: this.layout.size / tank.get().radius,
                level: tank.get().level,
                type: 'player',
                name: key,
            });

            return preview;
        });
    }

    pressed(x, y) {
        if (!this.tanks) return;

        const p = this.p;

        const total = this.tanks.length * (this.layout.width + this.layout.gap) - this.layout.gap;

        const index = this.tanks.findIndex((tank, index) => {
            const itemX = (p.width - total) / 2 + index * (this.layout.width + this.layout.gap);
            const itemY = this.layout.padding;

            return (
                x >= itemX &&
                x <= itemX + this.layout.width &&
                y >= itemY &&
                y <= itemY + this.layout.height
            );
        });

        return index === -1 ? null : this.tanks[index].constructor;
    }

    draw(tank) {
        if (!this.tanks) return;
        if (!tank) return;
        if (!tank.get().upgradeToken) return;

        const p = this.p;

        const total = this.tanks.length * (this.layout.width + this.layout.gap) - this.layout.gap;

        p.push();
        p.resetMatrix();

        this.tanks.forEach((tank, index) => {
            const x = (p.width - total) / 2 + index * (this.layout.width + this.layout.gap);
            const y = this.layout.padding;

            p.stroke(Color.upgrade.stroke);
            p.strokeWeight(this.layout.strokeWeight);
            p.fill(tank.previewColor.fill);
            p.rect(
                x,
                y,
                this.layout.width,
                this.layout.height,
            );

            p.stroke(Color.name.stroke);
            p.strokeWeight(this.layout.strokeWeight);
            p.fill(Color.name.color);
            p.textSize(this.layout.textSize);
            p.textAlign(p.CENTER, p.CENTER);
            p.textStyle(p.BOLD);
            p.text(
                `${tank.name}`,
                x + this.layout.width / 2,
                y + this.layout.height - this.layout.padding,
            );

            tank.draw();
        });

        p.pop();
    }
}