import Debug from "../tank/tier1/debug.js";
import Single from "../tank/tier1/single.js";

import Twin from "../tank/tier2/twin.js";
import Side from "../tank/tier2/side.js";
import Wide from "../tank/tier2/wide.js";
import Double from "../tank/tier2/double.js";
import Sniper from "../tank/tier2/sniper.js";
import Cannon from "../tank/tier2/cannon.js";
import Shotgun from "../tank/tier2/shotgun.js"

import Triple from "../tank/tier3/twin/triple.js";

import Quad from "../tank/tier3/side/quad.js";

import Machinegun from "../tank/tier3/wide/machinegun.js"

import Third from "../tank/tier3/double/third.js";
import BeamSaber from "../tank/tier3/double/beamSaber.js"

import Assassin from "../tank/tier3/sniper/assassin.js";

import Launcher from "../tank/tier3/cannon/launcher.js";

import DoubleBarrel from "../tank/tier3/shotgun/doubleBarrel.js"
import ShotRifle from "../tank/tier3/shotgun/shotRifle.js";

import Penta from "../tank/tier4/twin/penta.js";

import Octopus from "../tank/tier4/side/octopus.js";

import Laser from "../tank/tier4/double/laser.js"

import Deadeye from "../tank/tier4/sniper/deadeye.js"

import Converge from "../tank/tier5/twin/converge.js";

import Crown from "../tank/tier5/side/crown.js"

import Oneshot from "../tank/tier5/sniper/oneshot.js";

const Tanks = {
    debug: Debug,
    single: Single,
    
    twin: Twin,
    side: Side,
    wide: Wide,
    double: Double,
    sniper: Sniper,
    cannon: Cannon,
    shotgun: Shotgun,

    triple : Triple,
    quad: Quad,
    machinegun: Machinegun,
    third: Third,
    assassin: Assassin,
    launcher: Launcher,

    beamSaber: BeamSaber,
    shotRifle: ShotRifle,
    doubleBarrel: DoubleBarrel,

    penta: Penta,

    octopus: Octopus,

    laser: Laser,

    deadeye: Deadeye,

    converge: Converge,

    crown: Crown,

    oneshot: Oneshot,
};

export default Tanks;