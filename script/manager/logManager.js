import Color from "../config/color.js";

export default class LogManager {
    constructor(p) {
        this.p = p;

        this.logs = [];
        this.maxLogs = 10;
    }

    add(message) {
        this.logs.unshift(message);

        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }
    }

    spawn(target) {
        this.add(`${target.name}（${target.level}）が誕生した`);
    }

    kill(from, to) {
        this.add(`${from.name}（${from.level}）が ${to.name}（${to.level}）を倒した`);
    }

    tackle(from, to) {
        this.add(`${from.name}（${from.level}）が ${to.name}（${to.level}）を突進して倒した`);
    }

    destruction(target) {
        this.add(`${target.name}（${target.level}）が自滅した`);
    }

    awakening(target) {
        this.add(`${target.name}（${target.level}）が${target.tank}に進化した`);
    }

    watch(target) {
        this.add(`${target.name}（${target.level}）を観戦中`);
    }

    draw() {
        const p = this.p;

        p.push();
        p.resetMatrix();

        p.textAlign(p.LEFT, p.CENTER);

        this.logs.forEach((message, index) => {
            const x = 10;
            const y = 20 + index * 24;

            p.stroke(Color.name.stroke);
            p.strokeWeight(3);
            p.fill(Color.name.color);
            p.textSize(12);
            p.text(message, x + 8, y + 11);
        });

        p.pop();
    }
}