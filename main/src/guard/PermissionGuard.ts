import { CanActivate, ExecutionContext, Injectable, ForbiddenException, } from '@nestjs/common';
import { SettingsService } from 'src/modules/settings/settings.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly settingsService: SettingsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const callUrl = request.headers['x-call-url'];

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    if (!callUrl) {
      throw new ForbiddenException('No path provided');
    }

    const { level } = await this.settingsService.getPermissionLevel(user?.userRole?.roleId, callUrl);
    if (level === 0) {
      throw new ForbiddenException('No permission');
    }

    // permission-ийг request дээр хадгалж болно
    request.permissionLevel = level;
    return true;
  }
}