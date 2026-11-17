import Single from "../tank/tier1/Single.js";
import Twin from "../tank/tier2/twin.js";
import Side from "../tank/tier2/side.js";
import Wide from "../tank/tier2/wide.js";
import Sniper from "../tank/tier2/Sniper.js";
import Triple from "../tank/tier3/Twin/Triple.js";
import Trio from "../tank/tier3/Twin/Trio.js";
import Machinegun from "../tank/tier3/Twin/Machinegun.js";
import Hitting from "../tank/tier3/Twin/Hitting.js";
import Quad from "../tank/tier3/Side/Quad.js";
import SideTwin from "../tank/tier3/Side/SideTwin.js";
import SideGunner from "../tank/tier3/Side/SideGunner.js";
import Rocket from "../tank/tier3/Side/Rocket.js";
import Gunner from "../tank/tier3/Wide/Gunner.js";
import Shotgun from "../tank/tier3/Wide/Shotgun.js";
import Cannon from "../tank/tier3/Wide/Cannon.js";
import Diffusion from "../tank/tier3/Wide/Diffusion.js";
import Assassin from "../tank/tier3/Sniper/Assassin.js";
import HighSpeed from "../tank/tier3/Sniper/HighSpeed.js";
import Double from "../tank/tier3/Sniper/Double.js";
import Trap from "../tank/tier3/Sniper/Trap.js";
import Penta from "../tank/tier4/Triple/Penta.js";
import WidePellet from "../tank/tier4/Trio/WidePellet.js";
import Gatling from "../tank/tier4/Machinegun/Gatling.js";
import Octopus from "../tank/tier4/Quad/Octopus.js"
import Booster from "../tank/tier4/Rocket/Booster.js"
import ShotRifle from "../tank/tier4/Shotgun/ShotRifle.js"
import DoubleBarrel from "../tank/tier4/Shotgun/DoubleBarrel.js"
import MicroShotgun from "../tank/tier4/Shotgun/MicroShotgun.js"
import Gardener from "../tank/tier4/Shotgun/Gardener.js"

const Tanks = {
    tier1: {
        Single: Single,
    },
    tier2: {
        Single: {
            Twin: Twin,
            Side: Side,
            Wide: Wide,
            Sniper: Sniper,
        }
    },
    tier3: {
        Twin: {
            Triple : Triple,
            Trio: Trio,
            Machinegun: Machinegun,
            Hitting: Hitting,
        },
        Side: {
            Quad: Quad,
            SideTwin: SideTwin,
            SideGunner: SideGunner,
            Rocket: Rocket,
        },
        Wide: {
            Gunner: Gunner,
            Shotgun: Shotgun,
            Diffusion: Diffusion,
            Trap: Trap,
        },
        Sniper: {
            Assassin: Assassin,
            Cannon: Cannon,
            highSpeed: HighSpeed,
            Double: Double,
        },
    },
    tier4: {
        Triple : {
            Penta: Penta,
        },
        Trio: {
            WidePellet: WidePellet,
        },
        Machinegun: {
            Gatling: Gatling
        },
        Hitting: {},
        Quad: {
            Octopus: Octopus,
        },
        SideTwin: {},
        SideGunner: {},
        Rocket: {
            Booster: Booster,
        },
        Gunner: {},
        Shotgun: {
            ShotRifle: ShotRifle,
            DoubleBarrel: DoubleBarrel,
            MicroShotgun: MicroShotgun,
            Gardener: Gardener,
        },
        Cannon: {
            // Launcher: Launcher,
        },
        Diffusion: {
            // crossFire: CrossFire,
        },
        Assassin: {
            // Deadeye: Deadeye,
        },
        Double: {
            // third: Third,
            // beamSaber: BeamSaber,
            // burst: Burst,
            // mix
        },
        HighSpeed: {
            // speedStar: SpeedStar,
        },
        Trap: {
            // triTrap: TriTrap,
            // megaTrap: MegaTrap,
            // hybrid: Hybrid,
        },
    },
    tier5: {
        // Converge
        // Balkan
        // Crown
        // Barrage
        // Oneshot
        // Laser
        // Destroy
    }
};

export default Tanks;