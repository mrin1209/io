import Config from "../config/config.js";

export default class Player {
    constructor(p, tank) {
        this.p = p;
        this.tank = tank;

        if (Config.debug) {
            this.debug();
        }
    }

    run() {
        const p = this.p;

        const dx = p.mouseX - p.width / 2;
        const dy = p.mouseY - p.height / 2;

        this.tank.angle = Math.atan2(dy, dx);

        this.tank.run();
    }

    draw() {
        // this.tank.drawLight();
        this.tank.draw();
        this.tank.drawName();
        this.tank.drawHealth();
    }

    move(dx, dy, wallManager) {
        this.tank.move(dx, dy, wallManager);
    }

    shot(mx, my) {
        return this.tank.shot(mx, my);
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
        if (!this.tank.upgrade()) return false;

        this.tank = new TankClass({
            p: this.p,
            ...this.get()
        });

        this.debug();

        return this;
    }

    update(item) {
        this.debug();

        if (!this.tank.update(item)) return false;
    }

    get() {
        return this.tank.get();
    }

    debug() {
        const guns = this.tank.gun;
        const bullets = this.tank.bullet;

        let dps = 0;
        let distance = 0;

        const details = [];

        for (const gun of guns) {
            const bullet = bullets.find(item => item.id === gun.id);
            if (!bullet) continue;

            const gunDps = bullet.power * gun.count * (60 / gun.reload);
            dps += gunDps;

            let currentDistance = 0;
            let currentSpeed = bullet.speed;

            for (let count = 1; count <= bullet.range; count++) {
                currentDistance += currentSpeed;

                if (count >= bullet.range) break;

                if (count > bullet.duration) {
                    currentSpeed = Math.max(
                        0,
                        currentSpeed - bullet.deceleration
                    );
                }

                if (currentSpeed === 0) break;
            }

            currentDistance += bullet.radius + gun.length;
            distance = Math.max(distance, currentDistance);

            details.push({
                gun,
                bullet,
                dps: gunDps,
                distance: currentDistance,
            });
        }

        const killTime = 100 / dps;

        console.clear();

        console.log("機体名　　:", this.tank.constructor.name);
        console.log("累計経験値:", this.tank.totalExp);
        console.log("経験値　　:", this.tank.exp);
        console.log("必要経験値:", this.tank.getRequiredExp());

        console.log("最大体力　:", this.tank.tank.armor);
        console.log("機体体力　:", this.tank.tank.health);
        console.log("再生速度　:", this.tank.tank.regeneration);
        console.log("回復量　　　:", this.tank.tank.heal);
        console.log("機体速度　:", this.tank.tank.speed);
        console.log("反動速度　:", this.tank.tank.maxSpeed);
        console.log("接触攻撃力:", this.tank.tank.power);
        console.log("接触反動　:", this.tank.tank.recoil);

        console.log("--------------------");

        for (let i = 0; i < details.length; i++) {
            const { gun, bullet, dps, distance } = details[i];

            console.log(`Gun ${i + 1} (${gun.id})`);
            console.log("連射速度　:", gun.reload / this.tank.tank.shotCount);
            console.log("弾頭数　　:", gun.count);
            console.log("発射反動　　:", gun.recoil);
            console.log("弾丸速度　:", bullet.speed);
            console.log("消滅時間　:", bullet.range);
            console.log("耐久力　　:", bullet.armor);
            console.log("攻撃力　　:", bullet.power);
            console.log("着弾反動　　:", bullet.recoil);
            console.log("弾丸半径　　:", bullet.radius);
            console.log("秒速火力　:", dps.toFixed(2));
            console.log("飛距離　　:", distance.toFixed(2));
            console.log("--------------------");
        }

        console.log("合計秒速火力:", dps.toFixed(2));
        console.log("撃破時間　　:", killTime.toFixed(2), "秒");
        console.log("最大飛距離　:", distance.toFixed(2));
    }
}
