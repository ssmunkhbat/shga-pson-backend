import { PriPrisonerKeyView } from "./entity/pri/prisoner/priPrisonerKeyView"
import { UmSystemUser } from "./entity/um/um-system-user.entity"
import { UmUserRole } from "./entity/um/um-user-role"
import { MovementDeparture } from "./entity/pri/movement/movementDeparture.entity"
import { MovementArrival } from "./entity/pri/movement/movementArrival.entity"
import { PriMovementDeparturePack } from "./entity/pri/movement/PriMovementDeparturePack"
import { PriMovementDeparture } from "./entity/pri/movement/PriMovementDeparture"
import { PriMovementArrivalPack } from "./entity/pri/movement/PriMovementArrivalPack"
import { BasePerson } from "./entity/base/basePerson"
import { PriEmployee } from "./entity/pri/employee/priEmployee"
import { PriInfoPositionType } from "./entity/info/priInfoPositionType"
import { PriInfoMilitaryRank } from "./entity/info/priInfoMilitaryRank"
import { PriInfoDepartmentType } from "./entity/info/priInfoDepartmentType"
import { PriInfoDepartment } from "./entity/info/priInfoDepartment"
import { PriEmployeeKey } from "./entity/pri/employee/priEmployeeKey"
import { PriAdministrativeDecType } from "./entity/pri/administrative/priAdministrativeDecType"
import { PriAdministrativeDecision } from "./entity/pri/administrative/priAdministrativeDecision"
import { UmRole } from "./entity/um/umRole"

const Entities = [
  UmSystemUser, UmUserRole, UmRole,
  BasePerson,
  PriEmployee, PriEmployeeKey,
  PriPrisonerKeyView,
  MovementDeparture, MovementArrival,
  PriMovementDeparturePack, PriMovementDeparture, PriMovementArrivalPack,
  PriInfoDepartment, PriInfoDepartmentType, PriInfoPositionType, PriInfoMilitaryRank,
  PriAdministrativeDecType, PriAdministrativeDecision,
]
export default Entities