import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { CreateAuthDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/signin.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

@Public()
@Post('signup')
create(@Body() createAuthDto: CreateAuthDto){
    return this.authService.SignUp(createAuthDto)
}

@Public()
@Post('signin')
findOne(@Body() loginDto: LoginDto){
    return this.authService.SignIn(loginDto)
}

}