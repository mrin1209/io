import Color from "../config/color.js";

export default class LogManager {
    constructor(p) {
        this.p = p;

        this.logs = [];
        this.maxLogs = 10;
    }

    add(message, color = Color.name) {
        this.logs.unshift({ message, color });

        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }
    }

    spawn(target) {
        this.add(`${target.name}（${target.level}）が誕生した`, Color.green);
    }

    kill(from, to) {
        this.add(`${from.name}（${from.level}）が ${to.name}（${to.level}）を倒した`, Color.red);
    }

    tackle(from, to) {
        this.add(`${from.name}（${from.level}）が ${to.name}（${to.level}）を突進して倒した`, Color.red);
    }

    destruction(target) {
        this.add(`${target.name}（${target.level}）が自滅した`, Color.blue);
    }

    awakening(target) {
        this.add(`${target.name}（${target.level}）が${target.tank}に進化した`, Color.red);
    }

    watch(target) {
        this.add(`${target.name}（${target.level}）を観戦中`, Color.yellow);
    }

    object(target) {
        this.add(`八角形が出現した。exp: ${target.totalExp}`, Color.pink);
    }

    draw() {
        const p = this.p;

        p.push();
        p.resetMatrix();

        p.textAlign(p.LEFT, p.CENTER);

        this.logs.forEach((log, index) => {
            const x = 10;
            const y = 10 + index * 25;

            p.stroke(Color.name.border);
            p.strokeWeight(3);
            p.fill(log.color.fill);
            p.textSize(14);
            p.text(log.message, x + 8, y + 11);
        });

        p.pop();
    }
}