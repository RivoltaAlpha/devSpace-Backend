import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

type JWTPayload = {
  sub: number;
  email: string;
}

interface PayloadWithRT extends JWTPayload {
    refreshToken: string;
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
        constructor(private readonly configService: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
          passReqToCallback: true, // pass the req obj in the validate method
        });
      }

      validate(req: Request, payload: JWTPayload ): PayloadWithRT {
          const authHeader = req.get('Authorization');

          if(!authHeader) {
            throw new UnauthorizedException('No auth Header');
          }

          if(!authHeader.startsWith('Bearer')) {
            throw new UnauthorizedException('Invalid Auth header format');
          }

          const tr = authHeader.replace('Bearer', '').trim()

          if(!tr) {
            throw new UnauthorizedException('No token found')
          }

          return {
            sub: payload.sub,
            email: payload.email,
            refreshToken: tr
          };
;
      }
}