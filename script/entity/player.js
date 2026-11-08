import Config from "../config/config.js";

export default class Player {
    constructor(p, tank) {
        this.p = p;
        this.tank = tank;
        this.tank.owner = this;

        if (Config.debug) {
            this.debug();
        }
        
        // this.tank.level = 1;
        // this.tank.upgradeToken = 10;
        // this.tank.updateToken = 100;
    }

    run() {
        const p = this.p;

        const dx = p.mouseX - p.width / 2;
        const dy = p.mouseY - p.height / 2;

        this.tank.angle = Math.atan2(dy, dx);

        this.tank.run();
    }

    draw() {
        this.tank.drawLight();
        this.tank.draw();
        this.tank.drawName();
        this.tank.drawHealth();
    }

    move(dx, dy, wallManager) {
        this.tank.move(dx, dy, wallManager);
    }

    shot() {
        return this.tank.shot();
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

        if (Config.debug) {
            this.debug();
        }

        return this;
    }

    update(key, value) {
        this.tank.update(key, value);

        if (Config.debug) {
            this.debug();
        }
    }

    get() {
        return this.tank.get();
    }

    debug() {
        const gun = this.tank.gun;
        const bullet = this.tank.bullet;

        const dps = bullet.power * gun.count * (60 / gun.reload);
        const killTime = 100 / dps;

        let distance = 0;
        let currentSpeed = this.tank.bullet.speed;

        for (let count = 1; count <= this.tank.bullet.range; count++) {
            distance += currentSpeed;

            if (count >= this.tank.bullet.range) break;

            if (count > this.tank.bullet.duration) {
                currentSpeed = Math.max(
                    0,
                    currentSpeed - this.tank.bullet.deceleration
                );
            }

            if (currentSpeed === 0) break;
        }

        distance = distance + this.tank.bullet.radius + this.tank.gun.length;

        console.clear();
        console.log("機体名　　:", this.tank.constructor.name);
        console.log("累計経験値:", this.tank.totalExp);
        console.log("経験値　　:", this.tank.exp);
        console.log("必要経験値　　:", this.tank.getRequiredExp());
        console.log("最大体力　:", this.tank.tank.armor);
        console.log("機体体力　:", this.tank.tank.health);
        console.log("機体速度　:", this.tank.tank.speed);
        console.log("接触耐久力:", this.tank.tank.armor);
        console.log("接触攻撃力:", this.tank.tank.power);
        console.log("連射速度　:", this.tank.gun.reload);
        console.log("弾丸速度　:", this.tank.bullet.speed);
        console.log("耐久力　　:", this.tank.bullet.armor);
        console.log("攻撃力　　:", this.tank.bullet.power);
        console.log("弾頭数　　:", this.tank.gun.count);
        console.log("飛距離　　:", distance);
        console.log("--------------------");
        console.log("秒速火力:",dps.toFixed(2));
        console.log("撃破時間:", killTime.toFixed(2), "秒");
    }


}
