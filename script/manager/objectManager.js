import Collision from "../core/collision.js";
import Object from "../object/object.js";
import Config from "../config/config.js";

export default class ObjectManager {
    constructor(
        p,
        wallManager,
        bulletManager,
        logManager,
    ) {
        this.p = p;
        this.objects = [];

        this.wallManager = wallManager;
        this.bulletManager = bulletManager;
        this.logManager = logManager;

        this.collision = new Collision();
    }

    run() {
        if (
            this.objects.length < Config.max.object &&
            Math.random() < 1
        ) {
            this.spawn();
        }

        // タンク処理
        for (const object of this.objects) {
            object.run(
                this.wallManager,
                this.target(object)
            );
        }

        // オブジェクト同士の衝突判定
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                const objectA = this.objects[i];
                const objectB = this.objects[j];

                if (!objectA.get().active) continue;
                if (!objectB.get().active) continue;

                if (this.collision.circleCircle(objectA.get(), objectB.get())) {
                    if (objectA.hit(objectB.get())) {
                        objectB.kill(objectA.get());
                        objectA.death(objectB.get());

                        if (objectB.shapeIndex === 6) {
                            this.logManager.object(objectB.get());
                        }
                    } else if (objectB.hit(objectA.get())) {
                        objectA.kill(objectB.get());
                        objectB.death(objectA.get());

                        if (objectA.shapeIndex === 6) {
                            this.logManager.object(objectA.get());
                        }
                    }
                }
            }
        }
        
        // オブジェクトと弾丸の衝突処理
        for (const object of this.objects) {
            for (const bullet of this.bulletManager.bullets) {
                if (!bullet.get().active) continue;
                if (!object.get().active) continue;

                if (this.collision.circleCircle(bullet.get(), object.get())) {
                    if (bullet.collisions.has(object.get().id)) continue;

                    if (bullet.hit(object.get())) {
                        bullet.death();
                    }

                    if (object.hit(bullet.get())) {
                        bullet.owner.kill(object.get());
                        object.death(bullet.get());
                    }
                } else {
                    bullet.collisions.delete(object.get().id);
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
            if (
                object.get().x + object.get().radius < view.left ||
                object.get().x - object.get().radius > view.right ||
                object.get().y + object.get().radius < view.top ||
                object.get().y - object.get().radius > view.bottom
            ) continue;
            object.draw();
        }
    }
    

    spawn() {
        const position = this.spawnPosition();
        if (!position) return;

        const object = new Object(
            this.p,
            position.x,
            position.y
        );

        this.objects.push(object);
    }

    spawnPosition() {
        const maxAttempts = 1;
        const radius = 20;

        for (let i = 0; i < maxAttempts; i++) {
            const position = {
                x: Math.random() * (Config.map.width - radius * 2) + radius,
                y: Math.random() * (Config.map.height - radius * 2) + radius,
                radius,
            };

            // マップ外・壁との衝突をチェック
            if (this.collision.outside(position)) continue;
            if (this.wallManager.check(position)) continue;

            return { x: position.x, y: position.y };
        }

        // 安全な座標を見つけられなかった場合
        return null;
    }

    target(object) {
        return null;
        const { x, y, zoom } = object.get();

        const halfWidth = Config.view.width / zoom / 2;
        const halfHeight = Config.view.height / zoom / 2;

        let nearest = null;
        let minDistance = Infinity;

        for (const target of this.objects) {
            if (target.get().id === object.get().id) continue;
            if (!target.get().active) continue;

            const dx = target.get().x - x;
            const dy = target.get().y - y;

            if (Math.abs(dx) > halfWidth) continue;
            if (Math.abs(dy) > halfHeight) continue;

            const distance = dx * dx + dy * dy;

            if (distance < minDistance) {
                minDistance = distance;
                nearest = target.get();
            }
        }

        return nearest;
    }
}