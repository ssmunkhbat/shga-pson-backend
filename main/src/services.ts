import { PrisonerService } from "./modules/pri/prisoner/prisoner.service";
import { RefsService } from "./modules/refs/refs.service";
import { SettingsService } from "./modules/settings/settings.service";
import { TableConfigService } from "./modules/table-config/table-config.service";
import { RedisService } from "./thirdparty/redis/redis.service";


export const services = [
    TableConfigService,
    SettingsService,
    RedisService,
    RefsService,
    PrisonerService,
]