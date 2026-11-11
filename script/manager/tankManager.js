import Cpu from "../entity/cpu.js";
import Player from "../entity/player.js";
import Collision from "../core/collision.js";
import Config from "../config/config.js";
import Single from "../tank/tier1/single.js";

export default class TankManager {
    constructor(
        p,
        bulletManager,
        objectManager,
        wallManager,
        logManager,
    ) {
        this.p = p;
        this.tanks = [];

        this.bulletManager = bulletManager;
        this.objectManager = objectManager;
        this.wallManager = wallManager;
        this.logManager = logManager;
        
        this.collision = new Collision();

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
            Math.random() < 0.01
        ) {
            this.spawn();
        }

        // タンク処理
        for (const tank of this.tanks) {
            tank.run(this.wallManager);

            if (tank instanceof Cpu) {
                const target = this.target(tank);
                const bullet = tank.shot(target);

                if (bullet) {
                    this.bulletManager.add(bullet);
                }
            }
        }

        // 機体同士の衝突判定
        for (let i = 0; i < this.tanks.length; i++) {
            for (let j = i + 1; j < this.tanks.length; j++) {
                const tankA = this.tanks[i];
                const tankB = this.tanks[j];

                if (!tankA.get().active) continue;
                if (!tankB.get().active) continue;

                if (this.collision.circleCircle(tankA.get(), tankB.get())) {
                    if (tankA.hit(tankB.get())) {
                        tankB.kill(tankA.get());
                        tankA.death(tankB.get());

                        this.logManager.tackle(tankB.get(), tankA.get());
                        
                        if (this.watch && tankA.get().id === this.watch.get().id) {
                            this.changeWatch(tankB);
                        }

                        if (tankA.get().type === 'player') {
                            this.changeWatch(tankB);
                        }
                    }

                    if (tankB.hit(tankA.get())) {
                        tankA.kill(tankB.get());
                        tankB.death(tankA.get());

                        this.logManager.tackle(tankA.get(), tankB.get());

                        if (this.watch && tankB.get().id === this.watch.get().id) {
                            this.changeWatch(tankA);
                        }

                        if (tankB.get().type === 'player') {
                            this.changeWatch(tankA);
                        }
                    }
                }
            }
        }

        // 機体と弾丸の衝突処理
        for (const tank of this.tanks) {
            for (const bullet of this.bulletManager.bullets) {
                if (!tank.get().active) continue;
                if (!bullet.get().active) continue;
                if (bullet.owner?.get().id === tank.get().id) continue;
                
                if (this.collision.circleCircle(tank.get(), bullet.get())) {
                    if (bullet.collisions.has(tank.get().id)) continue;

                    if (bullet.hit(tank.get())) {
                        bullet.death();
                    }

                    if (tank.hit(bullet.get())) {
                        bullet.owner.kill(tank.get());
                        tank.death(bullet.owner.get());

                        this.logManager.kill(bullet.owner.get(), tank.get());

                        if (tank.get().type === 'player') {
                            this.changeWatch(bullet.owner);
                        }

                        if (this.watch && tank.get().id === this.watch.get().id) {
                            this.changeWatch(bullet.owner);
                        }
                    }
                } else {
                    bullet.collisions.delete(tank.get().id);
                }
            }
        }

        // 機体とオブジェクトの衝突処理
        for (const tank of this.tanks) {
            for (const object of this.objectManager.objects) {
                if (!tank.get().active) continue;
                if (!object.get().active) continue;

                if (this.collision.circleCircle(tank.get(), object.get())) {
                    if (object.hit(tank.get())) {
                        tank.kill(object.get());
                        object.death(tank.get());
                    }

                    if (tank.hit(object.get())) {
                        object.kill(tank.get());
                        tank.death(object.get());

                        this.logManager.destruction(tank.get());

                        if (object.shapeIndex === 6) {
                            this.logManager.object(object.get());
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

        if (this.player && this.watch) {
            this.watch = null;
        } else if (
            !this.player &&
            (
                !this.watch ||
                !this.watch.get().active ||
                this.watch.get().type !== 'cpu'
            ) &&
            this.tanks.some(tank =>
                tank.get().active && tank.get().type === 'cpu'
            )
        ) {
            // this.setWatch();
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

    draw() {
        // タンク処理
        for (const tank of this.tanks) {
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

        this.logManager.awakening(newTank.get());
    }

    update(tank) {
        if (!tank.update()) return false;
    }

    add(name) {
        const position = this.spawnPosition();
        if (!position) return;

        if (Config.debug) {
            position.x = Config.map.width / 2 - 100;
            position.y = Config.map.height / 2;
        }

        const player = new Player(
            this.p,
            new Single({
                p: this.p,
                x: position.x,
                y: position.y,
                name: name,
                type: 'player',
            })
        );

        this.tanks.push(player);
        this.player = player;

        this.logManager.spawn(player.get());
    }

    async spawn() {
        if (this.spawning) return;

        this.spawning = true;

        try {
            const position = this.spawnPosition();
            if (!position) return;

            if (Config.debug) {
                position.x = Config.map.width / 2;
                position.y = Config.map.height / 2;
            }

            let name;

            try {
                const response = await fetch(
                    "https://api.sylvain.sh/v6/username"
                );

                if (!response.ok) {
                    throw new Error("名前の取得に失敗しました");
                }

                const data = await response.json();
                name = data.animal;

            } catch (error) {
                console.error(error);
                name = `cpu${this.count}`;
            }

            const cpu = new Cpu(
                this.p,
                new Single({
                    p: this.p,
                    x: position.x,
                    y: position.y,
                    name: name,
                    type: 'cpu',
                })
            );

            this.tanks.push(cpu);

            this.count++;

            this.logManager.spawn(cpu.get());

        } finally {
            this.spawning = false;
        }
    }

    target(tank) {
        const { x, y, zoom } = tank.get();

        const halfWidth = Config.view.width / zoom / 2;
        const halfHeight = Config.view.height / zoom / 2;

        let nearest = null;
        let minDistance = Infinity;

        for (const targetTank of this.tanks) {
            const target = targetTank.get();

            if (target.id === tank.get().id) continue;
            if (!target.active) continue;

            const dx = target.x - x;
            const dy = target.y - y;

            if (Math.abs(dx) > halfWidth) continue;
            if (Math.abs(dy) > halfHeight) continue;

            const distance = dx * dx + dy * dy;

            if (distance < minDistance) {
                minDistance = distance;
                nearest = target;
            }
        }

        if (!nearest) {
            for (const object of this.objectManager.objects) {
                const target = object.get();

                if (!target.active) continue;

                const dx = target.x - x;
                const dy = target.y - y;

                if (Math.abs(dx) > halfWidth) continue;
                if (Math.abs(dy) > halfHeight) continue;

                const distance = dx * dx + dy * dy;

                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = target;
                }
            }
        }

        return nearest;
    }

    spawnPosition() {
        const maxAttempts = 1000;
        const radius = 50;

        for (let i = 0; i < maxAttempts; i++) {
            const position = {
                x: this.p.random(
                    radius,
                    Config.map.width - radius
                ),
                y: this.p.random(
                    radius,
                    Config.map.height - radius
                ),
                radius,
            };

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
}