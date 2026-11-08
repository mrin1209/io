import Color from "../config/color.js";
import Config from "../config/config.js"

export default class UpdateManager {
    constructor(p) {
        this.p = p;

        this.player = null;
        this.items = [];

        this.layout = {
            x: 10,
            bottom: 10,
            width: 200,
            height: 25,
            gap: 8,
            padding: 10,
        };
    }

    run(tank) {
        const tankData = tank.get();

        if (tankData.updateToken) {
            if (tankData.type === "cpu") {
                const items = tank.tank.status.items.filter(
                    item => item.count < Config.max.status
                );

                if (!items.length) return;

                const item = items[
                    Math.floor(this.p.random(items.length))
                ];

                tank.update(item.key);
            }
        }
    }

    create(tank) {
        this.player = tank;

        this.items = (tank.tank.status.items ?? []).map(item => ({
            ...item,
            x: 0,
            y: 0,
        }));

        const { height, gap, padding } = this.layout;

        this.items.forEach((item, index) => {
            item.x = this.layout.x;
            item.y = this.p.height
                - this.layout.bottom
                - this.items.length * height
                - (this.items.length - 1) * gap
                + index * (height + gap);
        });
    }

    pressed(x, y) {
        if (!this.player || !this.items.length) return null;

        const item = this.items.find(item =>
            item.count < Config.max.status &&
            x >= item.x &&
            x <= item.x + this.layout.width &&
            y >= item.y &&
            y <= item.y + this.layout.height
        );

        return item ?? null;
    }

    draw(tank) {
        if (!tank) return;
        if (!tank || !tank.get().updateToken) return;

        if (this.player !== tank || !this.items.length) {
            this.create(tank);
        }

        this.items.forEach((item, index) => {
            item.count = tank.tank.status.items[index].count;
        });

        const p = this.p;
        const status = tank.tank.status;

        p.push();
        p.resetMatrix();

        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(12);

        this.items.forEach(item => {
            const ratio = item.count / Config.max.status;

            // ゲージ背景
            p.noStroke();
            p.fill(item.color.fill);
            p.rect(
                item.x,
                item.y,
                this.layout.width,
                this.layout.height,
                5
            );

            // 強化ゲージ
            p.fill(item.color.border);
            p.rect(
                item.x,
                item.y,
                this.layout.width * ratio,
                this.layout.height,
                5
            );

            // 項目名
            p.stroke(Color.name.stroke);
            p.strokeWeight(3);
            p.fill(Color.name.color);
            p.text(
                item.name,
                item.x + 10,
                item.y + this.layout.height / 2
            );

            // 強化回数
            p.textAlign(p.RIGHT, p.CENTER);
            p.text(
                `${item.count}/${Config.max.status}`,
                item.x + this.layout.width - 10,
                item.y + this.layout.height / 2
            );

            p.textAlign(p.LEFT, p.CENTER);
        });

        p.pop();
    }
}