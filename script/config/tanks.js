import Debug from "../tank/tier1/debug.js";
import Single from "../tank/tier1/single.js";
import Twin from "../tank/tier2/twin.js";
import Side from "../tank/tier2/side.js";
import Wide from "../tank/tier2/wide.js";
import Sniper from "../tank/tier2/sniper.js";
import Triple from "../tank/tier3/triple.js";
import Quad from "../tank/tier3/quad.js";
import Gunner from "../tank/tier3/gunner.js";
import Shotgun from "../tank/tier3/shotgun.js";
import Cannon from "../tank/tier3/cannon.js";
import Assassin from "../tank/tier3/assassin.js";
import Double from "../tank/tier3/double.js";
import Penta from "../tank/tier4/penta.js";
import Octopus from "../tank/tier4/octopus.js";
import ShotRifle from "../tank/tier4/shotRifle.js";
import DoubleBarrel from "../tank/tier4/doubleBarrel.js";
import Launcher from "../tank/tier4/launcher.js";
import Deadeye from "../tank/tier4/deadeye.js";
import Converge from "../tank/tier5/converge.js";
import Crown from "../tank/tier5/crown.js";
import Oneshot from "../tank/tier5/oneshot.js";
import Laser from "../tank/tier5/laser.js";
import Destroy from "../tank/tier5/destroy.js";

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
            Debug: Debug,
        }
    },
    tier3: {
        Twin: {
            Triple : Triple,
            // trio: Trio,
            // machinegun: Machinegun,
            // hitting: Hitting,
        },
        Side: {
            Quad: Quad,
            // sideTwin: SideTwin,
            // sideGunner: SideGunner,
            // rocket: Rocket,
        },
        Wide: {
            Gunner: Gunner,
            Shotgun: Shotgun,
            Cannon: Cannon,
            // diffusion: Diffusion,
        },
        Sniper: {
            Assassin: Assassin,
            Double: Double,
            // highSpeed: HighSpeed,
            // trap: Trap,
        },
    },
    tier4: {
        Triple : {
            Penta: Penta,
            // chargeTriple: ChargeTriple,
        },
        Trio: {
            // widePellet: WidePellet,
        },
        Machinegun: {},
        Hitting: {},
        Quad: {
            Octopus: Octopus,
        },
        SideTwin: {},
        SideGunner: {},
        Rocket: {
            // booster: Booster,
        },
        Gunner: {},
        Shotgun: {
            ShotRifle: ShotRifle,
            DoubleBarrel: DoubleBarrel,
            // microShotgun: MicroShotgun,
            // gardener: Gardener,
        },
        Cannon: {
            Launcher: Launcher,
            // chargeCannon: ChargeCannon,
            // autoCannon: AutoCannon,
        },
        Diffusion: {
            // crossFire: CrossFire,
        },
        Assassin: {
            Deadeye: Deadeye,
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
        Converge: Converge,
        // octopus
        Crown: Crown,
        // widePellet
        // barrage: Barrage,
        // deadeye
        Oneshot: Oneshot,
        // third
        Laser: Laser,
        // launcher
        Destroy: Destroy,
    }
};

export default Tanks;