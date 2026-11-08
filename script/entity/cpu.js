import Config from "../config/config.js";

export default class Cpu {
    constructor(p, tank) {
        this.p = p;
        this.tank = tank;
        this.tank.owner = this;
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

    upgrade(TankClass) {
        if (!this.tank.upgradeToken) return;

        this.tank.upgradeToken--;

        this.tank = new TankClass({
            p: this.p,
            ...this.get()
        });

        this.tank.owner = this;

        return this;
    }

    update(key, value) {
        this.tank.update(key, value);
    }

    get() {
        return this.tank.get();
    }


}