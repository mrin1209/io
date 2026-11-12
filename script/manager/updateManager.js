import Color from "../config/color.js";

export default class UpdateManager {
    constructor(p) {
        this.p = p;

        this.player = null;

        this.layout = {
            padding: 10,
            width: 180,
            height: 20,
            gap: 10,
            textSize: 14,
            strokeWeight: 3,
        };
    }

    pressed(x, y) {
        if (!this.player) return null;

        const items = this.player.get().status.items ?? [];

        return [...items].reverse().find((item, index) => {
            const itemY = this.p.height - this.layout.padding - this.layout.height - (index * (this.layout.height + this.layout.gap));

            return (
                item.count < item.max &&
                x >= this.layout.padding &&
                x <= this.layout.padding + this.layout.width &&
                y >= itemY &&
                y <= itemY + this.layout.height
            );
        }) ?? null;
    }

    draw(tank) {
        if (!tank) return;
        if (tank.get().type === 'player') {
            this.player = tank;
        }

        const p = this.p;
        const items = tank.get().status.items ?? [];

        p.push();
        p.resetMatrix();

        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(this.layout.textSize);

        [...items].reverse().forEach((item, index) => {
            const y = p.height - this.layout.padding - this.layout.height - (index * (this.layout.height + this.layout.gap));
            // ゲージ背景
            p.stroke(Color.update.stroke);
            p.strokeWeight(this.layout.strokeWeight);
            p.fill(Color.update.back);
            p.rect(
                this.layout.padding,
                y,
                this.layout.width,
                this.layout.height,
            );

            // 強化ゲージ
            p.fill(item.color.border);
            p.rect(
                this.layout.padding,
                y,
                this.layout.width * item.count / item.max,
                this.layout.height,
            );

            // 項目名
            p.stroke(Color.name.stroke);
            p.strokeWeight(this.layout.strokeWeight);
            p.fill(Color.name.color);
            p.text(
                item.name,
                this.layout.padding * 2,
                y + (this.layout.height / 2),
            );
        });

        p.pop();
    }
}
