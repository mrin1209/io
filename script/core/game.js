import Config from "../config/config.js";
import Camera from "./camera.js";
import Field from "./field.js";
import BulletManager from "../manager/bulletManager.js";
import TankManager from "../manager/tankManager.js";
import ObjectManager from "../manager/objectManager.js";
import WallManager from "../manager/wallManager.js";
import LogSystem from "../system/log.js";
import UpgradeSystem from "../system/upgrade.js";
import UpdateSystem from "../system/update.js";
import ScoreSystem from "../system/score.js";
import MapSystem from "../system/map.js";
import Level from "../draw/level.js"
import Health from "../draw/health.js";
import Name from "../draw/name.js";

export default class Game {
    constructor(p) {
        this.p = p;

        this.camera = new Camera(this.p);
        this.field = new Field(this.p);

        this.wallManager = new WallManager(this.p);

        this.logSystem = new LogSystem(this.p);

        this.upgradeSystem = new UpgradeSystem(this.p);
        this.updateSystem = new UpdateSystem(this.p);

        this.scoreSystem = new ScoreSystem(this.p);

        this.bulletManager = new BulletManager(
            this.p,
            this.wallManager,
        );

        this.objectManager = new ObjectManager(
            this.p,
            this.wallManager,
            this.bulletManager,
            this.upgradeSystem,
            this.scoreSystem,
            this.logSystem,
        );

        this.tankManager = new TankManager(
            this.p,
            this.bulletManager,
            this.objectManager,
            this.wallManager,
            this.upgradeSystem,
            this.scoreSystem,
            this.logSystem,
        );

        this.scoreSystem.tankManager = this.tankManager;

        this.mapSystem = new MapSystem(
            this.p,
            this.wallManager,
            this.tankManager
        );

        this.drawLevel = new Level(this.p);
        this.drawHealth = new Health(this.p);
        this.drawName = new Name(this.p);

        this.objectManager.setup();
        this.tankManager.setup();

        // this.simulation();

        this.setup();
    }

    setup() {
        const input = document.getElementById("name-input");

        addEventListener("keydown", event => {
            if (this.tankManager.player) return;
            if (event.key !== "Enter") return;
            if (this.tankManager.spawn(input.value.trim())) {
                input.style.display = "none";
            }
        });

        this.nameInput = input;
    }

    run() {
        const p = this.p;

        this.loop();

        if (this.tankManager.player) {
            this.nameInput.style.display = "none";
        } else {
            this.nameInput.style.display = "block";
        }

        p.push();

        const tank = this.tankManager.player ?? this.tankManager.watch;
        const view = this.camera.run(tank ? tank.get() : {
            x: Config.map.width / 2,
            y: Config.map.height / 2,
        });

        this.field.draw();
        this.wallManager.draw(view);
        this.objectManager.draw(view);
        this.tankManager.draw(view);
        this.bulletManager.draw(view);

        this.updateSystem.draw(tank);
        this.upgradeSystem.draw(tank);
        this.mapSystem.draw();
        this.scoreSystem.draw();
        this.logSystem.draw();

        this.drawLevel.draw(tank);
        this.drawHealth.draw(tank);
        this.drawName.draw(tank);

        p.pop();
    }

    loop() {
        this.objectManager.run();
        this.tankManager.run();
        this.bulletManager.run();
    }

    simulation() {
        const start = performance.now();
        const total = 60 * 60 * 1;

        console.clear();

        for (let i = 0; i < total; i++) {
            this.loop();

            if (i % (total / 10) === 0) {
                console.log(`Loading... ${Math.floor(i / total * 100)}%`);
            }
        }
        console.log("Loading complete!");
        console.log(`Loading time: ${((performance.now() - start) / 1000).toFixed(2)} seconds`);
    }

    move(dx, dy) {
        if (!this.tankManager.player) return;

        this.tankManager.player.move(dx, dy, this.wallManager);
    }

    shot(mx, my) {
        if (!this.tankManager.player) return;
        
        const bullet = this.tankManager.player.shot(mx, my);

        if (bullet) {
            this.bulletManager.add(bullet);
        }

    }

    upgrade(x, y) {
        const tank = this.tankManager.player;

        if (!tank) return;
        if (!tank.get().upgradeToken) return;

        const TankClass = this.upgradeSystem.pressed(x, y);
        if (TankClass) {
            if (!tank.upgrade(TankClass)) return;

            this.tankManager.change(tank);
            this.tankManager.set(tank);

            this.logSystem.awakening(tank.get());
            this.upgradeSystem.set(tank);
        }
    }

    update(x, y) {
        const tank = this.tankManager.player;

        if (!tank) return;
        if (!tank.get().updateToken) return;

        const item = this.updateSystem.pressed(x, y);
        if (item) {
            if (!tank.update(item)) return;
        }
    }

    watch(x, y) {
        if (this.tankManager.player) return;

        const id = this.scoreSystem.pressed(x, y);
        if (id) {
            const tank = this.tankManager.tanks.find(
                item => item.get().id === id
            );
            if (!tank) return;

            this.tankManager.changeWatch(tank);
        } else {
            this.tankManager.clearWatch();
        }
    }

    resize() {
        if (this.tankManager.player) {
            this.upgradeSystem.set(this.tankManager.player);
        }
        this.scoreSystem.set();
    }

    zoom(delta) {
        if (!Config.debug) return;
        if (!this.tankManager.player) return;

        const zoomSpeed = 0.02;

        if (delta < 0) {
            this.tankManager.player.tank.tank.zoom += zoomSpeed;
            this.tankManager.player.tank.baseZoom += zoomSpeed;
        } else {
            this.tankManager.player.tank.tank.zoom -= zoomSpeed;
            this.tankManager.player.tank.baseZoom -= zoomSpeed;
        }
    }
}