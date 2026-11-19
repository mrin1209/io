import Config from "../config/config.js";
import Tanks from "../config/tanks.js";
import Random from "../core/random.js"

export default class Cpu {
    constructor(p, tank) {
        this.p = p;
        this.tank = tank;
        this.random = new Random();
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
            const moveAngle = this.random.get() * Math.PI * 2;

            this.dx = Math.cos(moveAngle);
            this.dy = Math.sin(moveAngle);

            this.tank.angle = this.random.get() * Math.PI * 2;

            this.moveTimer = 60 + Math.floor(this.random.get() * 120);
        }

        this.tank.move(this.dx, this.dy, wallManager);
        this.moveTimer--;
    }

    shot() {
        if (Config.debug) {
            return false;
        }

        if (this.tank.target) {
            this.tank.angle = Math.atan2(
                this.tank.target.get().y - this.tank.y,
                this.tank.target.get().x - this.tank.x,
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
        const TankClass = classes[Math.floor(this.random.get() * classes.length)];

        if (!this.tank.upgrade()) return false;

        this.tank = new TankClass({
            p: this.p,
            ...this.get()
        });

        return this;
    }

    update() {
        const items = this.tank.get().status.items.filter(
            item => item.count < item.max
        );

        if (!items.length) return false;
        const item = items[Math.floor(this.random.get() * items.length)];

        if (!this.tank.update(item)) return false;
    }

    setTarget(target) {
        this.tank.setTarget(target)
        this.search = 60;
    }

    get() {
        return this.tank.get();
    }


}