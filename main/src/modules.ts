import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

export const modules = [
    DatabaseModule,
    AuthModule,
    UserModule,
]