import { SettingsService } from "./modules/settings/settings.service";
import { TableConfigService } from "./modules/table-config/table-config.service";
import { RedisService } from "./thirdparty/redis/redis.service";


export const services = [
    TableConfigService,
    SettingsService,
    RedisService,
]