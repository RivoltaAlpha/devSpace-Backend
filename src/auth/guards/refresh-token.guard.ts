import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


export class RtGuard extends AuthGuard('refresh') {
        // override the rqst extract the request object from the context
        getRequest(context: ExecutionContext) {
            const request = super.getRequest(context);
            return request;
        }
}