import Color from "../config/color.js";

export default class LogManager {
    constructor(p) {
        this.p = p;

        this.logs = [];
        this.max = 10;

        this.layout = {
            padding: 10,
            height: 20,
            gap: 10,
            textSize: 14,
            strokeWeight: 3,
        };
    }

    add(message, color = Color.name) {
        this.logs.unshift({ message, color });

        if (this.logs.length > this.max) {
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
        p.textSize(this.layout.textSize);
        p.stroke(Color.name.stroke);
        p.strokeWeight(this.layout.strokeWeight);

        this.logs.forEach((log, index) => {
            p.fill(log.color.fill);
            p.text(
                log.message,
                this.layout.padding,
                this.layout.padding + (this.layout.height / 2) + (index * (this.layout.height + this.layout.gap))
            );
        });

        p.pop();
    }
}