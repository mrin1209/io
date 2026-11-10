import Config from "../config/config.js";
import Tanks from "../config/tanks.js";

export default class Cpu {
    constructor(p, tank) {
        this.p = p;
        this.tank = tank;
    }

    run(wallManager) {
        this.tank.run();

        if (Config.debug) {
            this.tank.move(0, 0, wallManager);
        } else {
            this.move(wallManager);
        }
    }

    draw() {
        this.tank.draw();
        this.tank.drawHealth();
        this.tank.drawName();
    }

    move(wallManager) {
        if (this.moveTimer === undefined || this.moveTimer <= 0) {
            const moveAngle = Math.random() * Math.PI * 2;

            this.dx = Math.cos(moveAngle);
            this.dy = Math.sin(moveAngle);

            this.tank.angle = Math.random() * Math.PI * 2;

            this.moveTimer = 60 + Math.floor(Math.random() * 120);
        }

        this.tank.move(this.dx, this.dy, wallManager);
        this.moveTimer--;
    }

    shot(target) {
        if (Config.debug) {
            return false;
        }

        if (target) {
            this.tank.angle = Math.atan2(
                target.y - this.tank.y,
                target.x - this.tank.x,
            );

            return this.tank.shot();
        }
    }

    hit(target) {
        return this.tank.hit(target);
    }

    kill(target) {
        return this.tank.kill(target);
    }

    death(target) {
        this.tank.death(target);
    }

    upgrade() {
        const tier = `tier${this.tank.get().tier + 1}`;
        const name = this.tank.get().tank;
        const candidates = Tanks[tier][name];
        if (!candidates || !Object.keys(candidates).length) return false;
        const classes = Object.values(candidates);
        const TankClass = classes[Math.floor(Math.random() * classes.length)];

        if (!this.tank.upgrade()) return false;

        this.tank = new TankClass({
            p: this.p,
            ...this.get()
        });

        return this;
    }

    update() {
        const items = this.tank.get().status.items.filter(
            item => item.count < Config.max.status
        );
        if (!items.length) return false;
        const item = items[Math.floor(Math.random() * items.length)];

        if (!this.tank.update(item)) return false;
    }

    get() {
        return this.tank.get();
    }


}