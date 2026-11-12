import Color from "../config/color.js";
import Config from "../config/config.js";

export default class mapManager {
    constructor(p, wallManager, tankManager) {
        this.p = p;

        this.wallManager = wallManager;
        this.tankManager = tankManager;

        this.layout = {
            padding: 10,
            size: 180,
            strokeWeight: 3,
            marker: 5,
        };

        this.scale = Math.min(
            this.layout.size / Config.map.width,
            this.layout.size / Config.map.height
        );
    }

    draw() {
        if (!this.tankManager.watch && !this.tankManager.player) return;
        
        const p = this.p;

        const width = Config.map.width * this.scale;
        const height = Config.map.height * this.scale;

        const x = p.width - width - this.layout.padding;
        const y = p.height - height - this.layout.padding;

        p.push();

        // カメラの影響を受けない画面座標に戻す
        p.resetMatrix();

        // マップ背景
        p.rectMode(p.CORNER);
        p.stroke(Color.map.border);
        p.strokeWeight(this.layout.strokeWeight);
        p.fill(Color.map.fill);
        p.rect(x, y, width, height);

        // マップ座標に変換
        p.translate(x, y);
        p.scale(this.scale);

        // 壁
        p.noStroke();
        p.fill(Color.map.wall);

        for (const wall of this.wallManager.walls) {
            p.rect(
                wall.x,
                wall.y,
                wall.width,
                wall.height
            );
        }

        for (const tank of this.tankManager.tanks) {
            if (!tank.get().active || tank.get().type !== "cpu") continue;

            p.fill(Color.map.cpu);

            p.circle(
                tank.get().x,
                tank.get().y,
                this.layout.marker / this.scale
            );
        }

        if (this.tankManager.player) {
            const player = this.tankManager.player.get();

            if (player.active) {
                p.fill(Color.map.player);

                p.circle(
                    player.x,
                    player.y,
                    this.layout.marker / this.scale
                );
            }
        }

        if (this.tankManager.watch) {
            const watch = this.tankManager.watch.get();

            if (watch.active) {
                p.fill(Color.map.watch);

                p.circle(
                    watch.x,
                    watch.y,
                    this.layout.marker / this.scale
                );
            }
        }

        p.pop();
    }
}
