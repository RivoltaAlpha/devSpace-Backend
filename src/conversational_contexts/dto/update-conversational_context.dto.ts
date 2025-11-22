import { PartialType } from '@nestjs/swagger';
import { CreateConversationalContextDto } from './create-conversational_context.dto';

export class UpdateConversationalContextDto extends PartialType(CreateConversationalContextDto) {}
