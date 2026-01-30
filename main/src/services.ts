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
import { OfficerService } from "./modules/pri/officer/officer.service";
import { NotificationService } from "./modules/pri/notification/notification.service";
import { UserService } from "./modules/user/user.service";
import { PriDetentionService } from "./modules/pri/detention/detention.service";
import { PriAddressService } from "./modules/pri/address/address.service";


export const services = [
    UserService,
    DynamicService,
    TableConfigService,
    RedisService,
    CacheService,
    RefsService,
    SettingsService,
    NotificationService,
    RoleService,
    PrisonerService,
    MovementService,
    EmployeeService,
    OfficerService,
    AdministrativeDecisionService,
    PriDetentionService,
    PriAddressService,
]