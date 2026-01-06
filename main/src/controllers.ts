import { AdministrativeDecisionController } from "./modules/pri/administrativeDecision/administrative.decision.controller";
import { EmployeeController } from "./modules/pri/employee/employee.controller";
import { MovementController } from "./modules/pri/movement/movement.controller";
import { PrisonerController } from "./modules/pri/prisoner/prisoner.controller";
import { RefsController } from "./modules/refs/refs.controller";
import { SettingsController } from "./modules/settings/settings.controller";
import { TableConfigController } from "./modules/table-config/table-config.controller";

export const controllers = [
    TableConfigController,
    SettingsController,
    RefsController,
    PrisonerController,
    MovementController,
    EmployeeController,
    AdministrativeDecisionController,
]