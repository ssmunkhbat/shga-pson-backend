import { CacheService } from "./modules/cache/cache.service";
import { DynamicService } from "./modules/dynamic/dynamic.service";
import { AdministrativeDecisionService } from "./modules/pri/administrativeDecision/administrative.decision.service";
import { EmployeeService } from "./modules/pri/employee/employee.service";
import { MovementService } from "./modules/pri/movement/movement.service";
import { PrisonerService } from "./modules/pri/prisoner/prisoner.service";
import { RefsService } from "./modules/refs/refs.service";
import { RoleService } from "./modules/settings/role.service";
import { SettingsService } from "./modules/settings/settings.service";
import { TableConfigService } from "./modules/table-config/table-config.service";
import { RedisService } from "./thirdparty/redis/redis.service";


export const services = [
    DynamicService,
    TableConfigService,
    RedisService,
    CacheService,
    RefsService,
    SettingsService,
    RoleService,
    PrisonerService,
    MovementService,
    EmployeeService,
    AdministrativeDecisionService,
]