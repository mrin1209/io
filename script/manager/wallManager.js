import Color from "../config/color.js";
import Collision from "../core/collision.js";
import Config from "../config/config.js";
import Random from "../core/random.js";

export default class WallManager {
    constructor(p) {
        this.p = p;

        this.walls = [];

        this.collision = new Collision();
        this.random = new Random();

        this.chunk = Config.view.chunk;
        this.mapWidth = Config.map.width;
        this.mapHeight = Config.map.height;

        this.columns = Math.floor(this.mapWidth / this.chunk);
        this.rows = Math.floor(this.mapHeight / this.chunk);

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

        const centerW = Math.ceil(Config.area.width / this.chunk);
        const centerH = Math.ceil(Config.area.height / this.chunk);

        const startX = Math.floor((this.columns - centerW) / 2);
        const startY = Math.floor((this.rows - centerH) / 2);

        for (let y = startY; y < startY + centerH; y++) {
            for (let x = startX; x < startX + centerW; x++) {
                occupied[y][x] = true;
            }
        }

        const sizes = [
            // { w: 1, h: 1, weight: 5 },
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
                this.random.get() * (this.columns - size.w - Config.wall.margin * 2 + 1)
            ) + Config.wall.margin;

            const row = Math.floor(
                this.random.get() * (this.rows - size.h - Config.wall.margin * 2 + 1)
            ) + Config.wall.margin;

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
                x: col * this.chunk,
                y: row * this.chunk,
                width: size.w * this.chunk,
                height: size.h * this.chunk,
            };

            this.walls.push(wall);

            for (let y = row; y < row + size.h; y++) {
                for (let x = col; x < col + size.w; x++) {
                    occupied[y][x] = true;
                }
            }

            occupiedCells += size.w * size.h;
        }

        let updated = true;
        while (updated) {
            updated = false;
            for (let y = 1; y < this.rows - 1; y++) {
                for (let x = 1; x < this.columns - 1; x++) {
                    if (occupied[y][x]) continue;

                    const count = [
                        occupied[y - 1][x], // 上
                        occupied[y + 1][x], // 下
                        occupied[y][x - 1], // 左
                        occupied[y][x + 1], // 右
                    ].filter(Boolean).length;

                    if (count >= 3) {
                        occupied[y][x] = true;

                        this.walls.push({
                            x: x * this.chunk,
                            y: y * this.chunk,
                            width: this.chunk,
                            height: this.chunk,
                        });

                        updated = true;
                    }
                }
            }

            for (let y = 0; y < this.rows - 1; y++) {
                for (let x = 0; x < this.columns - 1; x++) {

                    // 左上と右下が壁
                    if (
                        occupied[y][x] &&
                        occupied[y + 1][x + 1] &&
                        !occupied[y][x + 1] &&
                        !occupied[y + 1][x]
                    ) {
                        const scoreA =
                            Number(occupied[y - 1]?.[x] ?? false) +
                            Number(occupied[y + 1]?.[x + 2] ?? false);

                        const scoreB =
                            Number(occupied[y][x - 1] ?? false) +
                            Number(occupied[y + 2]?.[x + 1] ?? false);

                        let fill;

                        if (scoreA > scoreB) {
                            fill = 0;
                        } else if (scoreB > scoreA) {
                            fill = 1;
                        } else {
                            fill = Math.floor(this.random.get() * 2);
                        }

                        const fillX = fill === 0 ? x : x + 1;
                        const fillY = fill === 0 ? y + 1 : y;

                        occupied[fillY][fillX] = true;

                        this.walls.push({
                            x: fillX * this.chunk,
                            y: fillY * this.chunk,
                            width: this.chunk,
                            height: this.chunk,
                        });

                        updated = true;
                    }

                    // 右上と左下が壁
                    if (
                        occupied[y][x + 1] &&
                        occupied[y + 1][x] &&
                        !occupied[y][x] &&
                        !occupied[y + 1][x + 1]
                    ) {
                        const scoreA =
                            Number(occupied[y][x + 2] ?? false) +
                            Number(occupied[y + 2]?.[x] ?? false);

                        const scoreB =
                            Number(occupied[y - 1]?.[x + 1] ?? false) +
                            Number(occupied[y + 1]?.[x - 1] ?? false);

                        let fill;

                        if (scoreA > scoreB) {
                            fill = 0;
                        } else if (scoreB > scoreA) {
                            fill = 1;
                        } else {
                            fill = Math.floor(this.random.get() * 2);
                        }

                        const fillX = fill === 0 ? x : x + 1;
                        const fillY = fill === 0 ? y : y + 1;

                        occupied[fillY][fillX] = true;

                        this.walls.push({
                            x: fillX * this.chunk,
                            y: fillY * this.chunk,
                            width: this.chunk,
                            height: this.chunk,
                        });

                        updated = true;
                    }
                }
            }
        }
    }

    randomSize(sizes) {
        const totalWeight = sizes.reduce(
            (sum, size) => sum + size.weight,
            0
        );

        let random = this.random.get() * totalWeight;

        for (const size of sizes) {
            random -= size.weight;

            if (random < 0) {
                return size;
            }
        }

        return sizes[0];
    }

    draw(view) {
        const p = this.p;

        p.push();
        p.rectMode(p.CORNER);
        p.stroke(Color.wall.border);
        p.strokeWeight(2);
        p.fill(...Color.wall.fill);

        for (const wall of this.walls) {
            if (
                wall.x + wall.width < view.left ||
                wall.x > view.right ||
                wall.y + wall.height < view.top ||
                wall.y > view.bottom
            ) continue;

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

    get() {
        return {
            class: 'wall',
            power: 1000,
            penetration: 1000,
        }
    }
}