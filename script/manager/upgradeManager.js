import Tanks from "../config/tanks.js";
import Color from "../config/color.js";

export default class UpgradeManager {
    constructor(
        p,
        logManager
    ) {
        this.p = p;

        this.candidates = [];
        this.selectedTankClass = null;

        this.logManager = logManager;

        this.icon = {
            size: 80,
            gap: 10,
            radius: 15,
        };
    }

    run(tank, tankManager) {
        const tankData = tank.get();

        if (tankData.upgradeToken) {
            if (tankData.type === 'cpu') {
                const types = (tankData.upgrade ?? []).filter(type => Tanks[type]);

                if (types.length === 0) return;

                const index = Math.floor(this.p.random(types.length));
                const type = types[index];

                tankManager.upgrade(tank, Tanks[type]);
            } else {
                this.create(tankData);
            }
        }
    }

    create(tank) {
        this.candidates = (tank.upgrade ?? [])
            .filter(type => Tanks[type])
            .map(type => {
                const TankClass = Tanks[type];

                const preview = new TankClass({
                    p: this.p,
                    x: 0,
                    y: 0,
                    level: tank.level,
                    type: 'player',
                });

                return {
                    type,
                    TankClass,
                    preview,
                    x: 0,
                    y: 0,
                };
            });

        const { size, gap } = this.icon;

        const totalWidth = this.candidates.length * size
            + (this.candidates.length - 1) * gap;

        const startX = (this.p.width - totalWidth) / 2;
        const startY = this.p.height - size - 20;

        this.candidates.forEach((candidate, index) => {
            candidate.x = startX + index * (size + gap);
            candidate.y = startY;
        });
    }

    pressed(x, y) {
        const size = this.icon.size;

        const candidate = this.candidates.find(item =>
            x >= item.x &&
            x <= item.x + size &&
            y >= item.y &&
            y <= item.y + size
        );

        if (!candidate) return null;

        this.selectedTankClass = candidate.TankClass;

        this.create(candidate.preview);

        return this.selectedTankClass;
    }

    draw(tank) {
        if (!tank) return;
        if (!tank.get().upgradeToken) return;
        const p = this.p;
        const { size } = this.icon;

        p.push();

        p.resetMatrix();

        p.textAlign(p.CENTER, p.CENTER);

        this.candidates.forEach(candidate => {
            const x = candidate.x;
            const y = candidate.y;

            const preview = candidate.preview;

            p.fill(preview.previewColor.fill);
            p.stroke(Color.map.border);
            p.strokeWeight(2);
            p.rect(x, y, size, size);

            preview.x = x + size / 2;
            preview.y = y + size / 2;
            preview.angle = 0;

            preview.previewScale = this.icon.radius / preview.tank.radius;

            preview.draw();

            p.stroke(Color.name.stroke);
            p.strokeWeight(3);
            p.fill(Color.name.color);
            p.textSize(12);
            p.text(
                candidate.type,
                x + size / 2,
                y + size - 8
            );
        });

        p.pop();
    }
}