import Collision from "../core/collision.js";

export default class BulletManager {
    constructor(
        p,
        wallManager,
    ) {
        this.p = p;

        this.bullets = [];
        this.collision = new Collision();
        this.wallManager = wallManager;

        this.count = 0;
    }

    run() {
        // 弾丸処理
        for (const bullet of this.bullets) {
            const bulletData = bullet.get();
            bullet.run();

            if (!bulletData.active) continue;

            const data = bulletData;

            if (this.collision.outside(data)) {
                if (bullet.hit(this.collision.get())) {
                    bullet.death();
                }
                continue;
            }

            if (this.wallManager.check(data)) {
                if (bullet.hit(this.wallManager.get())) {
                    bullet.death();
                }
            }
        }

        // 弾丸同士の衝突判定
        for (let i = 0; i < this.bullets.length; i++) {
            const bulletA = this.bullets[i];
            const dataA = bulletA.get();
            if (!dataA.active) continue;
            for (let j = i + 1; j < this.bullets.length; j++) {
                const bulletB = this.bullets[j];
                const dataB = bulletB.get();
                if (!dataB.active) continue;

                if (bulletA.owner.get().id === bulletB.owner.get().id) continue;

                if (this.collision.circleCircle(dataA,dataB)){
                    if (bulletA.hit(dataB)) {
                        bulletB.kill(dataA);
                        bulletA.death(dataB);
                    }

                    if (bulletB.hit(dataA)) {
                        bulletA.kill(dataB);
                        bulletB.death(dataA);
                    }
                } else {
                    bulletA.collisions.delete(dataB.id);
                    bulletB.collisions.delete(dataA.id);
                }
            }
        }

        this.remove();
    }

    remove () {
        this.bullets = this.bullets.filter(
            bullet => bullet.get().active
        );
    }

    draw(view) {
        for (const bullet of this.bullets) {
            const bulletData = bullet.get();
            if (
                bulletData.x + bulletData.radius < view.left ||
                bulletData.x - bulletData.radius > view.right ||
                bulletData.y + bulletData.radius < view.top ||
                bulletData.y - bulletData.radius > view.bottom
            ) continue;

            bullet.draw();
        }
    }

    add(bullet) {
        const bullets = Array.isArray(bullet) ? bullet : [bullet];

        for (const item of bullets) {
            this.bullets.push(item);
        }
    }

    
}