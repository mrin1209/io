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
import LevelManager from "../manager/levelManager.js"
import Config from "../config/config.js";

export default class Game {
    constructor(p) {
        this.p = p;

        this.camera = new Camera(this.p);
        this.field = new Field(this.p);

        this.wallManager = new WallManager(this.p);

        this.logManager = new LogManager(this.p);

        this.upgradeManager = new UpgradeManager(this.p);
        this.updateManager = new UpdateManager(this.p);

        this.bulletManager = new BulletManager(
            this.p,
            this.wallManager,
        );

        this.objectManager = new ObjectManager(
            this.p,
            this.wallManager,
            this.bulletManager,
            this.logManager,
        );

        this.scoreManager = new ScoreManager(this.p);

        this.tankManager = new TankManager(
            this.p,
            this.bulletManager,
            this.objectManager,
            this.upgradeManager,
            this.wallManager,
            this.scoreManager,
            this.logManager,
        );

        this.mapManager = new MapManager(
            this.p,
            this.wallManager,
            this.tankManager
        );

        this.levelManager = new LevelManager(this.p);

        // for (let i = 0; i < 60 * 60; i++) {
        //     this.loop();
        // }

        this.setup();
    }

    setup() {
        const input = document.createElement("input");

        input.type = "text";
        input.value = "player";
        input.placeholder = "名前を入力してください";
        input.maxLength = 10;

        input.style.position = "fixed";
        input.style.left = "50%";
        input.style.top = "70%";
        input.style.transform = "translate(-50%, -50%)";
        input.style.width = "200px";
        input.style.padding = "12px";
        input.style.fontSize = "18px";
        input.style.textAlign = "center";
        input.style.zIndex = "1000";
        input.style.display = "none";

        document.body.appendChild(input);

        addEventListener("keydown", event => {
            if (event.key !== "Enter") return;

            const name = input.value.trim();

            if (this.tankManager.player) return;

            const success = this.tankManager.add(name);

            if (success) {
                input.value = "";
                input.style.display = "none";
            }
        });

        this.nameInput = input;
    }

    updateNameInput() {
        if (this.tankManager.player) {
            this.nameInput.style.display = "none";
        } else {
            this.nameInput.style.display = "block";
        }
    }

    run() {
        const p = this.p;

        this.loop();

        this.updateNameInput();

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
        this.levelManager.draw(tank);
        this.mapManager.draw();
        this.scoreManager.draw();
        this.logManager.draw();

        p.pop();
    }

    loop() {
        this.objectManager.run();
        this.tankManager.run();
        this.bulletManager.run();
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
        if (!id) return;

        const tank = this.tankManager.tanks.find(
            item => item.get().id === id
        );
        if (!tank) return;

        this.tankManager.changeWatch(tank);
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

    resize() {
        if (this.tankManager.player) {
            this.upgradeManager.set(this.tankManager.player);
        }
        this.scoreManager.set(this.tankManager.tanks);
    }
}