import Color from "../config/color.js";

export default class ScoreManager {
    constructor(p, tankManager) {
        this.p = p;
        this.tankManager = tankManager;

        this.x = 20;
        this.y = 20;
        this.rowHeight = 45;

        this.previews = new WeakMap();

        this.icon = {
            size: 30,
        };
    }

    getPreview(player) {
        const tank = player.tank;

        const cached = this.previews.get(player);
        if (cached?.tank === tank) return cached.preview;

        const TankClass = tank.constructor;

        const preview = new TankClass({
            p: this.p,
            x: 0,
            y: 0,
            level: tank.level,
            name: tank.name,
            type: tank.type,
        });

        this.previews.set(player, {
            level: tank.level,
            preview,
        });

        return preview;
    }

    draw() {
        if (!this.tankManager.player) return;

        const ranking = this.tankManager.tanks
            .filter(item => item.tank.active)
            .sort((a, b) => b.tank.level - a.tank.level)
            .slice(0, 10);

        const p = this.p;
        const x = p.width - this.x;
        const y = this.y;

        p.push();
        p.resetMatrix();

        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);

        ranking.forEach((tank, index) => {
            const rowY = y + index * this.rowHeight;
            const preview = this.getPreview(tank);

            preview.x = x - 20;
            preview.y = rowY;
            preview.angle = 0;

            preview.previewScale = 15 / preview.tank.radius;

            preview.draw();

            p.textAlign(p.RIGHT, p.CENTER);
            p.stroke(Color.name.stroke);
            p.strokeWeight(3);
            p.fill(Color.name.color);
            p.text(`${tank.get().name} (${tank.get().level})`, x - 45, rowY - 1);
        });

        p.pop();
    }
}
