import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './thirdparty/redis/redis.module';

export const modules = [
    DatabaseModule,
    AuthModule,
    UserModule,
    RedisModule,
]