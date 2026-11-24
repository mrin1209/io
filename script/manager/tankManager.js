import Cpu from "../entity/cpu.js";
import Player from "../entity/player.js";
import Collision from "../core/collision.js";
import Config from "../config/config.js";
import Single from "../tank/tier1/Single.js";
import Random from "../core/random.js";

export default class TankManager {
    constructor(
        p,
        bulletManager,
        objectManager,
        upgradeManager,
        wallManager,
        scoreManager,
        logManager,
    ) {
        this.p = p;
        this.tanks = [];

        this.bulletManager = bulletManager;
        this.objectManager = objectManager;
        this.upgradeManager = upgradeManager;
        this.wallManager = wallManager;
        this.scoreManager = scoreManager;
        this.logManager = logManager;
        
        this.collision = new Collision();
        this.random = new Random();

        this.count = 0;

        this.player = null;
        this.watch = null;
    }

    run() {
        const cpuCount = this.tanks.filter(tank =>
            tank.get().type === 'cpu'
        ).length;

        if (
            cpuCount < Config.max.tank &&
            this.random.get() < 0.01
        ) {
            this.spawn();
        }

        // タンク処理
        for (const tank of this.tanks) {
            tank.run(this.wallManager);

            if (tank instanceof Cpu) {
                if (tank.tank.search <= 0) {
                    tank.setTarget(this.target(tank));
                    tank.setObject(this.search(tank));
                }

                const bullet = tank.shot();

                if (bullet) {
                    this.bulletManager.add(bullet);
                }
            }
        }

        // 機体同士の衝突判定
        for (let i = 0; i < this.tanks.length; i++) {
            const tankA = this.tanks[i];
            const dataA = tankA.get();
            if (!dataA.active) continue;
            for (let j = i + 1; j < this.tanks.length; j++) {
                const tankB = this.tanks[j];
                const dataB = tankB.get();
                if (!dataB.active) continue;

                if (this.collision.circleCircle(dataA, dataB)) {
                    if (tankA.hit(dataB)) {
                        tankB.kill(dataA);
                        tankA.death(dataB);

                        this.logManager.tackle(dataB, dataA);
                        this.scoreManager.set();

                        if (this.watch && dataA.id === this.watch.get().id) {
                            this.changeWatch(tankB);
                        }

                        if (dataA.type === 'player') {
                            this.changeWatch(tankB);
                        }

                        if (dataB.type === 'player') {
                            this.upgradeManager.set(tankB);
                        }
                    }

                    if (tankB.hit(dataA)) {
                        tankA.kill(dataB);
                        tankB.death(dataA);

                        this.logManager.tackle(dataA, dataB);
                        this.scoreManager.set();

                        if (this.watch && dataB.id === this.watch.get().id) {
                            this.changeWatch(tankA);
                        }

                        if (dataB.type === 'player') {
                            this.changeWatch(tankA);
                        }

                        if (dataA.type === 'player') {
                            this.upgradeManager.set(tankA);
                        }
                    }
                }
            }
        }

        // 機体と弾丸の衝突処理
        for (const tank of this.tanks) {
            const tankData = tank.get();
            if (!tankData.active) continue;
            for (const bullet of this.bulletManager.bullets) {
                const bulletData = bullet.get();
                const ownerData = bullet.owner.get();
                if (!bulletData.active) continue;
                if (ownerData.id === tankData.id) continue;
                
                if (this.collision.circleCircle(tankData, bulletData)) {
                    if (bullet.collisions.has(tankData.id)) continue;

                    if (bullet.hit(tankData)) {
                        bullet.death();
                    }

                    if (tank.hit(bulletData)) {
                        bullet.owner.kill(tankData);
                        tank.death(ownerData);

                        this.logManager.kill(ownerData, tankData);
                        this.scoreManager.set();

                        if (this.watch && tankData.id === this.watch.get().id) {
                            this.changeWatch(bullet.owner);
                        }

                        if (tankData.type === 'player') {
                            this.changeWatch(bullet.owner);
                        }

                        if (ownerData.type === 'player') {
                            this.upgradeManager.set(bullet.owner);
                        }
                    }
                } else {
                    bullet.collisions.delete(tankData.id);
                }
            }
        }

        // 機体とオブジェクトの衝突処理
        for (const tank of this.tanks) {
            const tankData = tank.get();
            if (!tankData.active) continue;
            for (const object of this.objectManager.objects) {
                const objectData = object.get();
                if (!objectData.active) continue;

                if (this.collision.circleCircle(tankData, objectData)) {
                    if (object.hit(tankData)) {
                        tank.kill(objectData);
                        object.death(tankData);

                        this.scoreManager.set();

                        if (tankData.type === 'player') {
                            this.upgradeManager.set(tank);
                        }
                    }

                    if (tank.hit(objectData)) {
                        object.kill(tankData);
                        tank.death(objectData);

                        this.logManager.destruction(tankData);
                        this.scoreManager.set();

                        if (object.shapeIndex === 6) {
                            this.logManager.object(objectData);
                        }
                    }
                }
            }
        }

        // 機体のアップグレード
        for (const tank of this.tanks) {
            if (tank.get().type !== "cpu") continue;
            this.update(tank);
            this.upgrade(tank);
        }

        this.remove();

        if (this.player) {
            this.watch = null;
        }

        if (
            this.watch &&
            this.watch.get().type === 'player' &&
            !this.watch.get().active
        ) {
            this.setWatch();
        }
    }

    remove() {
        if (this.player && !this.player.get().active) {
            this.player = null;
        }

        this.tanks = this.tanks.filter(
            tank => tank.get().active
        );

        this.bulletManager.bullets = this.bulletManager.bullets.filter(
            bullet => bullet.get().active
        );

        this.objectManager.objects = this.objectManager.objects.filter(
            object => object.get().active
        );
    }

    draw(view) {
        for (const tank of this.tanks) {
            const tankData = tank.get();
            if (
                tankData.x + tankData.radius < view.left ||
                tankData.x - tankData.radius > view.right ||
                tankData.y + tankData.radius < view.top ||
                tankData.y - tankData.radius > view.bottom
            ) continue;

            tank.draw();
        }
    }

    change(tank) {
        this.tanks = this.tanks.filter(item => item.get().id !== tank.get().id);
        this.tanks.push(tank);
    }

    set(tank) {
        this.player = tank;
    }

    upgrade(tank) {
        const newTank = tank.upgrade();
        if (!newTank) return false;

        this.change(newTank);

        if (this.watch) {
            if (newTank.get().id === this.watch.get().id) {
                this.watch = newTank;
            }
        }

        this.scoreManager.set();
        this.logManager.awakening(newTank.get());
    }

    update(tank) {
        if (!tank.update()) return false;
    }

    spawn(name) {
        const position = this.spawnPosition();
        if (!position) return;

        if (Config.debug) {
            position.x = Config.map.width / 2 - 100;
            position.y = Config.map.height / 2;
        }

        let tank;

        if (name) {
            tank = new Player(
                this.p,
                new Single({
                    p: this.p,
                    x: position.x,
                    y: position.y,
                    name: name,
                    type: 'player',
                    ...(Config.debug && {
                        level: 0,
                        upgradeToken: 5,
                        updateToken: 100,
                    }),
                })
            );

            this.player = tank;
            this.upgradeManager.set(tank);
        } else {
            tank = new Cpu(
                this.p,
                new Single({
                    p: this.p,
                    x: position.x,
                    y: position.y,
                    name: `cpu${this.count}`,
                    type: 'cpu',
                })
            );

            this.count++;
        }

        this.tanks.push(tank);
        this.logManager.spawn(tank.get());
        this.scoreManager.set();
    }

    target(tank) {
        const { x, y, zoom, id } = tank.get();

        const halfWidth = Config.view.width / zoom / 2;
        const halfHeight = Config.view.height / zoom / 2;

        return this.tanks
            .filter(target => {
                const data = target.get();

                if (data.id === id) return false;
                if (!data.active) return false;

                const dx = data.x - x;
                const dy = data.y - y;

                return Math.abs(dx) <= halfWidth &&
                    Math.abs(dy) <= halfHeight;
            })
            .sort((a, b) => {
                const A = a.get();
                const B = b.get();

                const distanceA = (A.x - x) ** 2 + (A.y - y) ** 2;
                const distanceB = (B.x - x) ** 2 + (B.y - y) ** 2;

                return distanceA - distanceB;
            });
    }

    search(tank) {
        const { x, y, zoom, id } = tank.get();

        const halfWidth = Config.view.width / zoom / 2;
        const halfHeight = Config.view.height / zoom / 2;

        return this.objectManager.objects
            .filter(target => {
                const data = target.get();

                if (data.id === id) return false;
                if (!data.active) return false;

                const dx = data.x - x;
                const dy = data.y - y;

                return Math.abs(dx) <= halfWidth &&
                    Math.abs(dy) <= halfHeight;
            })
            .sort((a, b) => {
                const A = a.get();
                const B = b.get();

                return B.totalExp - A.totalExp ||
                    ((A.x - x) ** 2 + (A.y - y) ** 2) -
                    ((B.x - x) ** 2 + (B.y - y) ** 2);
            });
    }

    spawnPosition() {
        const maxAttempts = 2000;
        const radius = 100;

        const centerX = Config.map.width / 2;
        const centerY = Config.map.height / 2;

        const areaW = Config.map.width * Config.spawn.width;
        const areaH = Config.map.height * Config.spawn.height;

        for (let i = 0; i < maxAttempts; i++) {
            const position = {
                x: this.random.get(
                    radius,
                    Config.map.width - radius
                ),
                y: this.random.get(
                    radius,
                    Config.map.height - radius
                ),
                radius,
            };

            const insideYellowArea =
                Math.abs(position.x - centerX) < areaW / 2 &&
                Math.abs(position.y - centerY) < areaH / 2;

            if (insideYellowArea) continue;

            // マップ外・壁との衝突をチェック
            if (this.collision.outside(position)) continue;
            if (this.wallManager.check(position)) continue;

            // 既存の戦車との重なりも防ぐ
            const overlapsTank = this.tanks.some(tank =>
                this.collision.circleCircle(position, tank.get())
            );

            if (overlapsTank) continue;

            return { x: position.x, y: position.y };
        }

        // 安全な座標を見つけられなかった場合
        return null;
    }

    changeWatch(tank) {
        if (!tank) return;
        if (!tank.get().active) return;
        if (tank.get().type === 'player') return;

        this.watch = tank;
        this.player = null;

        this.logManager.watch(this.watch.get());
    }

    setWatch() {
        this.watch = this.tanks
            .filter(tank =>
                tank.get().active &&
                tank.get().type === 'cpu'
            )
            .sort((a, b) =>
                b.get().level - a.get().level
            )[0] ?? null;

        if (this.watch) {
            this.logManager.watch(this.watch.get());
        }
    }

    clearWatch() {
        this.watch = null;
    }
}