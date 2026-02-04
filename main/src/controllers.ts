import { AdministrativeDecisionController } from "./modules/pri/administrativeDecision/administrative.decision.controller";
import { EmployeeController } from "./modules/pri/employee/employee.controller";
import { OfficerController } from "./modules/pri/officer/officer.controller";
import { MovementController } from "./modules/pri/movement/movement.controller";
import { PrisonerController } from "./modules/pri/prisoner/prisoner.controller";
import { RefsController } from "./modules/refs/refs.controller";
import { SettingsController } from "./modules/settings/settings.controller";
import { TableConfigController } from "./modules/table-config/table-config.controller";
import { NotificationController } from "./modules/pri/notification/notification.controller";
import { PriAddressController } from "./modules/pri/address/address.controller";
import { LeaveController } from './modules/pri/leave/leave.controller';
import { PriDecisionController } from "./modules/pri/decision/decision.controller";
export const controllers = [
    TableConfigController,
    SettingsController,
    RefsController,
    NotificationController,
    PrisonerController,
    MovementController,
    EmployeeController,
    OfficerController,
    AdministrativeDecisionController,
    PriAddressController,
    LeaveController,
    PriDecisionController,
]