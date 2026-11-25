import Color from "../config/color.js";
import Config from "../config/config.js";

export default class Field {
    constructor(p) {
        this.p = p;
    }

    draw() {
        const p = this.p;

        p.background(Color.world.back);

        p.push();

        p.noStroke();
        
        const spawnWidth = Config.spawn.width;
        const spawnHeight = Config.spawn.height;

        p.fill(Color.world.spawn);
        p.rect(
            (Config.map.width - spawnWidth) / 2,
            (Config.map.height - spawnHeight) / 2,
            spawnWidth,
            spawnHeight
        );

        const areaWidth = Config.area.width;
        const areaHeight = Config.area.height;

        p.fill(Color.world.center);
        p.rect(
            (Config.map.width - areaWidth) / 2,
            (Config.map.height - areaHeight) / 2,
            areaWidth,
            areaHeight
        );

        p.strokeWeight(1);
        p.stroke(Color.world.grid);

        for (let x = 0; x <= Config.map.width; x += Config.view.grid) {
            p.line(x, 0, x, Config.map.height);
        }

        for (let y = 0; y <= Config.map.height; y += Config.view.grid) {
            p.line(0, y, Config.map.width, y);
        }

        p.stroke(Color.world.chunk);

        for (let x = 0; x <= Config.map.width; x += Config.view.chunk) {
            p.line(x, 0, x, Config.map.height);
        }

        for (let y = 0; y <= Config.map.height; y += Config.view.chunk) {
            p.line(0, y, Config.map.width, y);
        }

        p.pop();
    }
}