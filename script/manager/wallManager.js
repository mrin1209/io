import Color from "../config/color.js";
import Collision from "../core/collision.js";
import Config from "../config/config.js";

export default class WallManager {
    constructor(p) {
        this.p = p;

        this.walls = [];

        this.collision = new Collision();

        this.grid = Config.view.grid;
        this.mapWidth = Config.map.width;
        this.mapHeight = Config.map.height;

        this.columns = Math.floor(this.mapWidth / this.grid);
        this.rows = Math.floor(this.mapHeight / this.grid);

        if (!Config.debug) {
            this.generate();
        }
    }

    generate() {
        this.walls = [];

        const occupied = Array.from(
            { length: this.rows },
            () => Array(this.columns).fill(false)
        );

        const sizes = [
            { w: 1, h: 1, weight: 5 },
            { w: 4, h: 1, weight: 4 },
            { w: 1, h: 4, weight: 4 },
            { w: 3, h: 1, weight: 3 },
            { w: 1, h: 3, weight: 3 },
            { w: 2, h: 1, weight: 2 },
            { w: 1, h: 2, weight: 2 },
            { w: 2, h: 2, weight: 1 },
            { w: 3, h: 2, weight: 1 },
            { w: 2, h: 3, weight: 1 },
            { w: 3, h: 3, weight: 1 },
        ];

        const targetCells = Math.floor(
            this.columns * this.rows * Config.wall.density
        );

        let occupiedCells = 0;
        let attempts = 0;

        while (
            occupiedCells < targetCells &&
            attempts < this.columns * this.rows * 20
            ) {
            attempts++;

            const size = this.randomSize(sizes);

            const col = Math.floor(
                Math.random() * (this.columns - size.w - 1)
            ) + 1;

            const row = Math.floor(
                Math.random() * (this.rows - size.h - 1)
            ) + 1;

            // 配置先の重なりを確認
            let canPlace = true;

            for (let y = row; y < row + size.h; y++) {
                for (let x = col; x < col + size.w; x++) {
                    if (occupied[y][x]) {
                        canPlace = false;
                        break;
                    }
                }

                if (!canPlace) break;
            }

            if (!canPlace) continue;

            const wall = {
                x: col * this.grid,
                y: row * this.grid,
                width: size.w * this.grid,
                height: size.h * this.grid,
            };

            this.walls.push(wall);

            for (let y = row; y < row + size.h; y++) {
                for (let x = col; x < col + size.w; x++) {
                    occupied[y][x] = true;
                }
            }

            occupiedCells += size.w * size.h;
        }
    }

    randomSize(sizes) {
        const totalWeight = sizes.reduce(
            (sum, size) => sum + size.weight,
            0
        );

        let random = Math.random() * totalWeight;

        for (const size of sizes) {
            random -= size.weight;

            if (random < 0) {
                return size;
            }
        }

        return sizes[0];
    }

    draw() {
        const p = this.p;

        p.push();
        p.rectMode(p.CORNER);
        p.stroke(Color.wall.border);
        p.strokeWeight(2);
        p.fill(...Color.wall.fill);

        for (const wall of this.walls) {
            p.rect(
                wall.x,
                wall.y,
                wall.width,
                wall.height
            );
        }

        p.pop();
    }

    check(target) {
        return this.walls.some(wall =>
            this.collision.circleRect(target, wall)
        );
    }

    checkRect(target) {
        return this.walls.some(wall =>
            this.collision.rectRect(target, wall)
        );
    }

    get() {
        return {
            class: 'wall',
            power: 100,
            penetration: 100,
        }
    }
}