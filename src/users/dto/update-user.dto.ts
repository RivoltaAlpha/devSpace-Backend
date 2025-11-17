import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    email?: string;

    @ApiPropertyOptional()
    password?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiPropertyOptional()
    hashedRefreshedToken?: string | null;
}
