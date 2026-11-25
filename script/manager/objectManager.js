import Collision from "../core/collision.js";
import Object from "../object/object.js";
import Config from "../config/config.js";
import Random from "../core/random.js";

export default class ObjectManager {
    constructor(
        p,
        wallManager,
        bulletManager,
        upgradeManager,
        scoreManager,
        logManager,
    ) {
        this.p = p;
        this.objects = [];

        this.wallManager = wallManager;
        this.bulletManager = bulletManager;
        this.upgradeManager = upgradeManager;
        this.scoreManager = scoreManager;
        this.logManager = logManager;

        this.collision = new Collision();
        this.random = new Random();
    }

    setup() {
        while (this.objects.length < Config.max.object) {
            this.spawn();
        }
    }

    run() {
        if (
            this.objects.length < Config.max.object &&
            this.random.get() < 1
        ) {
            this.spawn();
        }

        // オブジェクト処理
        for (const object of this.objects) {
            let target = null;

            if (object.search <= 0) {
                target = this.target(object);
                object.search = 60;
            }

            object.run(
                this.wallManager,
                target
            );
        }

        // オブジェクト同士の衝突判定
        for (let i = 0; i < this.objects.length; i++) {
            const objectA = this.objects[i];
            const dataA = objectA.get();
            if (!dataA.active) continue;
            for (let j = i + 1; j < this.objects.length; j++) {
                const objectB = this.objects[j];
                const dataB = objectB.get();
                if (!dataB.active) continue;

                if (this.collision.circleCircle(dataA, dataB)) {
                    if (objectA.hit(dataB)) {
                        objectB.kill(dataA);
                        objectA.death(dataB);

                        if (objectB.shapeIndex === 6) {
                            if (!objectB.lastShape && !objectA.lastShape) {
                                objectB.lastShape = true;
                                this.logManager.object(dataB);
                            }
                        }
                    } else if (objectB.hit(dataA)) {
                        objectA.kill(dataB);
                        objectB.death(dataA);

                        if (objectA.shapeIndex === 6) {
                            if (!objectA.lastShape && !objectB.lastShape) {
                                objectA.lastShape = true;
                                this.logManager.object(dataA);
                            }
                        }
                    }
                }
            }
        }
        
        // オブジェクトと弾丸の衝突処理
        for (const object of this.objects) {
            const objectData = object.get();
            if (!objectData.active) continue;
            for (const bullet of this.bulletManager.bullets) {
                const bulletData = bullet.get();
                if (!bulletData.active) continue;

                if (this.collision.circleCircle(bulletData, objectData)) {
                    if (bullet.collisions.has(objectData.id)) continue;

                    if (bullet.hit(objectData)) {
                        bullet.death();
                    }

                    if (object.hit(bulletData)) {
                        bullet.owner.kill(objectData);
                        object.death(bulletData);

                        this.scoreManager.set();

                        if (bullet.owner.get().type === 'player') {
                            this.upgradeManager.set(bullet.owner);
                        }
                    }
                } else {
                    bullet.collisions.delete(objectData.id);
                }
            }
        }

        this.remove();
    }

    remove() {
        this.objects = this.objects.filter(
            object => object.get().active
        );

        this.bulletManager.bullets = this.bulletManager.bullets.filter(
            bullet => bullet.get().active
        );
    }

    draw(view) {
        for (const object of this.objects) {
            const objectData = object.get();
            if (
                objectData.x + objectData.radius < view.left ||
                objectData.x - objectData.radius > view.right ||
                objectData.y + objectData.radius < view.top ||
                objectData.y - objectData.radius > view.bottom
            ) continue;
            object.draw();
        }
    }
    

    spawn() {
        const position = this.spawnPosition();
        if (!position) return;

        let candidates;
        let weights;

        if (position.level === 1) {
            candidates = [0, 50, 150, 350];
            weights = [53, 40, 10, 2];
        } else if (position.level === 2) {
            candidates = [0, 50, 150, 350];
            weights = [10, 50, 30, 10];
        } else {
            candidates = [350, 750, 1550];
            weights = [90, 9, 1];
        }

        let random = this.random.get() * weights.reduce((a, b) => a + b);

        let exp = candidates[candidates.length - 1];

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];

            if (random < 0) {
                exp = candidates[i];
                break;
            }
        }

        const object = new Object(
            this.p,
            position.x,
            position.y,
            exp
        );

        this.objects.push(object);
    }

    spawnPosition() {
        const maxAttempts = 1;
        const radius = 40;

        const centerX = Config.map.width / 2;
        const centerY = Config.map.height / 2;

        const areaW = Config.map.width * Config.area.width;
        const areaH = Config.map.height * Config.area.height;

        const spawnW = Config.map.width * Config.spawn.width;
        const spawnH = Config.map.height * Config.spawn.height;

        for (let i = 0; i < maxAttempts; i++) {
            const position = {
                x: this.random.get() * (Config.map.width - radius * 2) + radius,
                y: this.random.get() * (Config.map.height - radius * 2) + radius,
                radius,
            };

            if (this.collision.outside(position)) continue;
            if (this.wallManager.check(position)) continue;

            const dx = Math.abs(position.x - centerX);
            const dy = Math.abs(position.y - centerY);

            let level;

            if (dx <= areaW / 2 && dy <= areaH / 2) {
                level = 3;
            } else if (dx <= spawnW / 2 && dy <= spawnH / 2) {
                level = 2;
            } else {
                level = 1;
            }

            return {
                x: position.x,
                y: position.y,
                level,
            };
        }

        return null;
    }

    target(object) {
        const { id, x, y, zoom } = object.get();

        const halfWidth = Config.view.width / zoom / 2;
        const halfHeight = Config.view.height / zoom / 2;

        let nearest = null;
        let minDistance = Infinity;

        for (const target of this.objects) {
            const targetData = target.get();

            if (targetData.id === id) continue;
            if (!targetData.active) continue;

            const dx = targetData.x - x;
            const dy = targetData.y - y;

            if (Math.abs(dx) > halfWidth) continue;
            if (Math.abs(dy) > halfHeight) continue;

            const distance = dx * dx + dy * dy;

            if (distance < minDistance) {
                minDistance = distance;
                nearest = targetData;
            }
        }

        return nearest;
    }
}