import Config from "../config/config.js";
import Camera from "./camera.js";
import Field from "./field.js";
import LogManager from "../manager/logManager.js";
import BulletManager from "../manager/bulletManager.js";
import TankManager from "../manager/tankManager.js";
import ObjectManager from "../manager/objectManager.js";
import WallManager from "../manager/wallManager.js";
import UpgradeManager from "../manager/upgradeManager.js";
import UpdateManager from "../manager/updateManager.js";
import ScoreManager from "../manager/scoreManager.js";
import MapManager from "../manager/mapManager.js";
import Level from "../draw/level.js"
import Health from "../draw/health.js";
import Name from "../draw/name.js";

export default class Game {
    constructor(p) {
        this.p = p;

        this.camera = new Camera(this.p);
        this.field = new Field(this.p);

        this.wallManager = new WallManager(this.p);

        this.logManager = new LogManager(this.p);

        this.upgradeManager = new UpgradeManager(this.p);
        this.updateManager = new UpdateManager(this.p);

        this.scoreManager = new ScoreManager(this.p);

        this.bulletManager = new BulletManager(
            this.p,
            this.wallManager,
        );

        this.objectManager = new ObjectManager(
            this.p,
            this.wallManager,
            this.bulletManager,
            this.upgradeManager,
            this.scoreManager,
            this.logManager,
        );

        this.tankManager = new TankManager(
            this.p,
            this.bulletManager,
            this.objectManager,
            this.upgradeManager,
            this.wallManager,
            this.scoreManager,
            this.logManager,
        );

        this.scoreManager.tankManager = this.tankManager;

        this.mapManager = new MapManager(
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

        this.updateManager.draw(tank);
        this.upgradeManager.draw(tank);
        this.mapManager.draw();
        this.scoreManager.draw();
        this.logManager.draw();

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
        const total = 60 * 60 * 6;

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

        const TankClass = this.upgradeManager.pressed(x, y);
        if (TankClass) {
            if (!tank.upgrade(TankClass)) return;

            this.tankManager.change(tank);
            this.tankManager.set(tank);

            this.logManager.awakening(tank.get());
            this.upgradeManager.set(tank);
        }
    }

    update(x, y) {
        const tank = this.tankManager.player;

        if (!tank) return;
        if (!tank.get().updateToken) return;

        const item = this.updateManager.pressed(x, y);
        if (item) {
            if (!tank.update(item)) return;
        }
    }

    watch(x, y) {
        if (this.tankManager.player) return;

        const id = this.scoreManager.pressed(x, y);
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
            this.upgradeManager.set(this.tankManager.player);
        }
        this.scoreManager.set();
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