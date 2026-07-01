import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // EXACTAMENTE la misma llave y decodificación que en Spring Boot
      secretOrKey: Buffer.from('404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970', 'base64'),
    });
  }

  async validate(payload: any) {
    // Esto se inyectará automáticamente en "request.user" de tus controladores
    return { 
      userId: payload.userId, 
      username: payload.sub, 
      roles: payload.roles 
    };
  }
}