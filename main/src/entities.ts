import { PriPrisonerKeyView } from "./entity/pri/prisoner/priPrisonerKeyView"
import { UmSystemUser } from "./entity/um/um-system-user.entity"
import { UmUserRole } from "./entity/um/um-user-role"
import { MovementDeparture } from "./entity/pri/movement/movementDeparture.entity"
import { MovementArrival } from "./entity/pri/movement/movementArrival.entity"
import { PriMovementDeparturePack } from "./entity/pri/movement/PriMovementDeparturePack"
import { PriMovementDeparture } from "./entity/pri/movement/PriMovementDeparture"
import { PriMovementArrivalPack } from "./entity/pri/movement/PriMovementArrivalPack"

const Entities = [
  UmSystemUser, UmUserRole,
  PriPrisonerKeyView,
  MovementDeparture, MovementArrival,
  PriMovementDeparturePack, PriMovementDeparture, PriMovementArrivalPack,
]
export default Entities