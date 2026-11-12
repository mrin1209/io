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
            bullet.run();

            if (!bullet.get().active) continue;

            const data = bullet.get();

            if (this.collision.outside(data)) {
                if (bullet.hit(this.wallManager.get())) {
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
            for (let j = i + 1; j < this.bullets.length; j++) {
                const bulletA = this.bullets[i];
                const bulletB = this.bullets[j];

                if (!bulletA.get().active) continue;
                if (!bulletB.get().active) continue;
                if (bulletA.owner.get().id === bulletB.owner.get().id) continue;

                if (this.collision.circleCircle(bulletA.get(),bulletB.get())){
                    if (bulletA.hit(bulletB.get())) {
                        bulletB.kill(bulletA.get());
                        bulletA.death(bulletB.get());
                    }

                    if (bulletB.hit(bulletA.get())) {
                        bulletA.kill(bulletB.get());
                        bulletB.death(bulletA.get());
                    }
                } else {
                    bulletA.collisions.delete(bulletB.get().id);
                    bulletB.collisions.delete(bulletA.get().id);
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
            if (
                bullet.get().x + bullet.get().radius < view.left ||
                bullet.get().x - bullet.get().radius > view.right ||
                bullet.get().y + bullet.get().radius < view.top ||
                bullet.get().y - bullet.get().radius > view.bottom
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