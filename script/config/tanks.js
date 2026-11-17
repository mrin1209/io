import Single from "../tank/tier1/single.js";
import Twin from "../tank/tier2/twin.js";
import Side from "../tank/tier2/side.js";
import Wide from "../tank/tier2/wide.js";
import Sniper from "../tank/tier2/sniper.js";
import Triple from "../tank/tier3/twin/triple.js";
import Trio from "../tank/tier3/twin/trio.js";
import Machinegun from "../tank/tier3/twin/machinegun.js";
import Hitting from "../tank/tier3/twin/hitting.js";
import Quad from "../tank/tier3/side/quad.js";
import SideTwin from "../tank/tier3/side/sideTwin.js";
import SideGunner from "../tank/tier3/side/sideGunner.js";
import Rocket from "../tank/tier3/side/rocket.js";
import Gunner from "../tank/tier3/wide/Gunner.js";
import Shotgun from "../tank/tier3/wide/Shotgun.js";
import Cannon from "../tank/tier3/wide/Cannon.js";
import Diffusion from "../tank/tier3/wide/Diffusion.js";
import Assassin from "../tank/tier3/sniper/Assassin.js";
import HighSpeed from "../tank/tier3/sniper/HighSpeed.js";
import Double from "../tank/tier3/sniper/Double.js";
import Trap from "../tank/tier3/sniper/Trap.js";

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
            Cannon: Cannon,
            Shotgun: Shotgun,
            diffusion: Diffusion,
        },
        Sniper: {
            Assassin: Assassin,
            highSpeed: HighSpeed,
            Double: Double,
            trap: Trap,
        },
    },
    tier4: {
        Triple : {
            // Penta: Penta,
            // chargeTriple: ChargeTriple,
        },
        Trio: {
            // widePellet: WidePellet,
        },
        Machinegun: {},
        Hitting: {},
        Quad: {
            // Octopus: Octopus,
        },
        SideTwin: {},
        SideGunner: {},
        Rocket: {
            // booster: Booster,
        },
        Gunner: {},
        Shotgun: {
            // ShotRifle: ShotRifle,
            // DoubleBarrel: DoubleBarrel,
            // microShotgun: MicroShotgun,
            // gardener: Gardener,
        },
        Cannon: {
            // Launcher: Launcher,
            // chargeCannon: ChargeCannon,
            // autoCannon: AutoCannon,
        },
        Diffusion: {
            // crossFire: CrossFire,
        },
        Assassin: {
            // Deadeye: Deadeye,
            // autoAssassin: AutoAssassin,
            // chargeAssassin: ChargeAssassin,
        },
        Double: {
            // third: Third,
            // beamSaber: BeamSaber,
            // burst: Burst,
        },
        HighSpeed: {
            // speedStar: SpeedStar,
        },
        Trap: {
            // triTrap: TriTrap,
            // megaTrap: MegaTrap,
            // hybrid: Hybrid,
            // autoTrap: AutoTrap,
        },
    },
    tier5: {
        // penta
        // Converge: Converge,
        // octopus
        // Crown: Crown,
        // widePellet
        // barrage: Barrage,
        // deadeye
        // Oneshot: Oneshot,
        // third
        // Laser: Laser,
        // launcher
        // Destroy: Destroy,
    }
};

export default Tanks;