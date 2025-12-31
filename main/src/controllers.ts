import { RefsController } from "./modules/refs/refs.controller";
import { SettingsController } from "./modules/settings/settings.controller";
import { TableConfigController } from "./modules/table-config/table-config.controller";

export const controllers = [
    TableConfigController,
    SettingsController,
    RefsController,
]