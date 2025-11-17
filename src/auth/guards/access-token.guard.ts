import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard('access') {
    constructor(
        private reflector: Reflector
    ) {
        super();
    }
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getClass(),
            context.getHandler(),
        ]);

        if(isPublic){
            return true; // allow access without authentication 
        }

        return super.canActivate(context)
    }

    // override the rqst extract the object from the context
    getRequest(context: ExecutionContext) {
        const request = super.getRequest(context);
        return request;
    }
}