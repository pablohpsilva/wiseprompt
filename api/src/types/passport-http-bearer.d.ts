declare module "passport-http-bearer" {
  import { Strategy as PassportStrategy } from "passport-strategy";

  export class Strategy extends PassportStrategy {
    constructor(options: any | Function, verify?: Function);
    name: string;
    verify: Function;
    authenticate(req: any, options?: any): void;
  }
}
