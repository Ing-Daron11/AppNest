import { Injectable, UnauthorizedException } from "@nestjs/common";
import {ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy  extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService, 
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
      ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get('JWT_SECRET') as string | 'secret',
        });
      }

    async validate(payload: any){
        const id = payload.user_id;
        
        const user = await this.userRepository.findOneBy({id})

        if(!user)
            throw new UnauthorizedException('invalid token');

        if(!user.isActive)
            throw new UnauthorizedException('inactive user')

        return user;
    }
}