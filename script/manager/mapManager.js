
import Color from "../config/color.js";
import Config from "../config/config.js";

export default class mapManager {
    constructor(p, wallManager, tankManager) {
        this.p = p;

        this.wallManager = wallManager;
        this.tankManager = tankManager;

        this.size = 200;
        this.padding = 10;

        this.scale = Math.min(
            this.size / Config.map.width,
            this.size / Config.map.height
        );
    }

    draw() {
        if (!this.tankManager.player) return;
        
        const p = this.p;

        const width = Config.map.width * this.scale;
        const height = Config.map.height * this.scale;

        const x = p.width - width - this.padding;
        const y = p.height - height - this.padding;

        p.push();

        // カメラの影響を受けない画面座標に戻す
        p.resetMatrix();

        // マップ背景
        p.rectMode(p.CORNER);
        p.stroke(Color.map.border);
        p.strokeWeight(3);
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

        // 戦車
        for (const tank of this.tankManager.tanks) {
            const data = tank.get();

            if (!data.active) continue;

            if (data.type === "player") {
                p.fill(Color.blue.border);
            } else {
                p.fill(Color.red.border);
            }

            p.circle(
                data.x,
                data.y,
                5 / this.scale
            );
        }

        p.pop();
    }
}
