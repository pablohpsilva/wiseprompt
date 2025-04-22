import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException("Please authenticate");
    }
    return user;
  }
}

@Injectable()
export class LooseJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info) {
    if (err) {
      throw err || new UnauthorizedException("Please authenticate");
    }

    return user;
  }
}
