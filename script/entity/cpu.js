import Tanks from "../config/tanks.js";
import Random from "../core/random.js"
import Collision from "../core/collision.js";
import Config from "../config/config.js";

export default class Cpu {
    constructor(p, tank) {
        this.p = p;
        this.tank = tank;
        this.random = new Random();
        this.dx = 0;
        this.dy = 0;
        this.turning = 0;
        this.goal = null;
        this.moveTimer = 0;
        this.strafeDirection = this.random.get() < 0.5 ? -1 : 1;

        this.collision = new Collision();
    }

    run(wallManager) {
        this.tank.run();

        this.tank.targets = this.tank.targets.filter(target =>
            target.get().active && this.tank.scan(target.get())
        );

        this.tank.objects = this.tank.objects.filter(target =>
            target.get().active && this.tank.scan(target.get())
        );

        // 目標地点が存在する場合、追いかける
        if (this.goal) {
            if (this.tank.targets.length) {
                this.tank.target = this.tank.targets[0];
                this.goal = null;
                this.moveTimer = 0;
            }
        } else {
            // 現在のターゲットが倒されている場合、新しいターゲットを設定
            if (!this.tank.target || !this.tank.target.get().active) {
                this.tank.target = this.tank.targets[0] ?? null;
            }

            // 現在のターゲットが範囲外に出た場合、目標地点を定め追いかける
            if (this.tank.target && !this.tank.scan(this.tank.target.get())) {
                this.goal = this.tank.target.get();
                this.tank.target = this.tank.targets[0] ?? null;
                this.tank.object = null;

                if (this.tank.target) {
                    this.goal = null;
                }
            }

            // ターゲットが存在する場合、オブジェクトのターゲットは解除する
            if (this.tank.target) {
                this.tank.object = null;
            // ターゲットが存在しないかつ、オブジェクトも存在しない場合、オブジェクトをターゲットにする
            } else if (!this.tank.object || !this.tank.object.get().active) {
                this.tank.object = this.tank.objects[0] ?? null;
            }
            // オブジェクトが範囲外に出た場合、目標地点を定め追いかける
            if (this.tank.object && !this.tank.scan(this.tank.object.get())) {
                this.goal = this.tank.object.get();
                this.tank.object = null;
            }
        }

        this.move(wallManager);
    }

    draw() {
        this.tank.draw();
        this.tank.drawHealth();
        this.tank.drawName();
    }

    move(wallManager) {
        const target = this.tank.target?.get() ?? this.tank.object?.get();

        if (this.goal) {
            const dx = this.goal.x - this.tank.x;
            const dy = this.goal.y - this.tank.y;
            const distance = Math.hypot(dx, dy);

            const line = {
                x1: this.tank.x,
                y1: this.tank.y,
                x2: this.goal.x,
                y2: this.goal.y,
            };

            const blocked = wallManager.walls.some(wall =>
                this.collision.lineRect(line, wall)
            );

            if (
                distance < this.tank.get().radius ||
                blocked
            ) {
                this.goal = null;
                this.moveTimer = 0;
                this.dx = 0;
                this.dy = 0;
            } else {
                this.dx = dx / distance;
                this.dy = dy / distance;
                this.rotate(Math.atan2(dy, dx), 60);
            }
        } else if (target?.active) {
            const dx = target.x - this.tank.x;
            const dy = target.y - this.tank.y;
            const distance = Math.hypot(dx, dy);

            const angle = Math.atan2(dy, dx);
            const desiredDistance = this.tank.bullet[0].duration * this.tank.bullet[0].speed;

            if (this.moveTimer <= 0) {
                const direction = Math.floor(this.random.get() * 3);

                this.turning = [-1, 0, 1][direction];
                this.moveTimer = 120;
            }

            const forward =
                distance > desiredDistance + 30 ? 1 :
                distance < desiredDistance - 30 ? -1 : 0;

            this.dx = Math.cos(angle) * forward - Math.sin(angle) * this.turning;
            this.dy = Math.sin(angle) * forward + Math.cos(angle) * this.turning;

            const length = Math.hypot(this.dx, this.dy);

            if (length > 0) {
                this.dx /= length;
                this.dy /= length;
            }
        } else if (this.moveTimer <= 0) {
            if (this.random.get() < 0.2) {
                const { x, y, zoom, radius } = this.tank.get();

                const halfWidth = Config.view.width / zoom / 2;
                const halfHeight = Config.view.height / zoom / 2;

                for (let i = 0; i < 200; i++) {
                    const goal = {
                        x: this.random.get(x - halfWidth, x + halfWidth),
                        y: this.random.get(y - halfHeight, y + halfHeight)
                    };

                    if (this.collision.outside({ ...goal, radius })) continue;

                    const line = {
                        x1: x,
                        y1: y,
                        x2: goal.x,
                        y2: goal.y,
                    };

                    const blocked = wallManager.walls.some(wall =>
                        this.collision.lineRect(line, wall)
                    );

                    if (blocked) continue;

                    this.goal = goal;

                    const dx = goal.x - x;
                    const dy = goal.y - y;
                    const distance = Math.hypot(dx, dy);

                    this.dx = dx / distance;
                    this.dy = dy / distance;

                    this.rotate(Math.atan2(dy, dx), 60);

                    this.moveTimer = 180;
                    break;
                }
            } else {
                const moveAngle = this.random.get() * Math.PI * 2;

                this.dx = Math.cos(moveAngle);
                this.dy = Math.sin(moveAngle);

                this.moveTimer = 60;
            }
        } else {
            this.rotate(Math.atan2(this.dy, this.dx), 180);
        }

        this.tank.move(this.dx, this.dy, wallManager);
        this.moveTimer--;
    }

    shot() {
        const target = this.tank.target?.get() ?? this.tank.object?.get();

        if (!target?.active) return false;

        const dx = target.x - this.tank.x;
        const dy = target.y - this.tank.y;

        const vx = (target.owner?.vx ?? 0) - this.tank.vx;
        const vy = (target.owner?.vy ?? 0) - this.tank.vy;

        const a = vx * vx + vy * vy - this.tank.bullet[0].speed * this.tank.bullet[0].speed;
        const b = 2 * (dx * vx + dy * vy);
        const c = dx * dx + dy * dy;

        const discriminant = b * b - 4 * a * c;

        let time = 0;

        if (Math.abs(a) < 0.000001) {
            if (b < 0) time = -c / b;
        } else if (discriminant >= 0) {
            const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
            const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

            const times = [t1, t2].filter(t => t > 0);

            time = times.length ? Math.min(...times) : 0;
        }

        const angle = Math.atan2(
            dy + vy * time,
            dx + vx * time
        );

        this.rotate(angle, 10);

        return this.tank.shot();
    }

    rotate(angle, speed) {
        let diff = angle - this.tank.angle;

        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        this.tank.angle += Math.max(-Math.PI / speed, Math.min(Math.PI / speed, diff));
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
        const candidates = Tanks[tier]?.[name];
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
    }

    setObject(target) {
        this.tank.setObject(target)
    }

    get() {
        return this.tank.get();
    }
}