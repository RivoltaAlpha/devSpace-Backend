import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database/database.module";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AccessStrategy } from "./strategies/access.strategy";
import { RefreshStrategy } from "./strategies/refresh.strategy";
import { RolesGuard } from "./guards/roles.guard";

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.register(
            {
                global: true
            }
        ),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [AuthService, AccessStrategy, RefreshStrategy,RolesGuard],
    controllers: [AuthController],
    exports: [RolesGuard],
})

export class AuthModule {}