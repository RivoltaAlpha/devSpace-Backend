import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { User, UserRole } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { ROLES_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getClass(),
            context.getHandler()
        ]);
        
        if(!requiredRoles){
            return true // no roles req allow access 
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(!user){
            return false // deny access if no user is found 
        }

        // fetch user from the db
        const verifiedUser = await this.userRepository.findOne({
            where: {user_id: user.user_id},
            select: ['user_id', 'email', 'role'],
        });

        if(!verifiedUser){
            return false // deny access if not found 
        }

        // check if user role matches required role
        return requiredRoles.some((role) => verifiedUser.role === role);
    }
}