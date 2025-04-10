declare module "passport-strategy" {
  export class Strategy {
    constructor();
    authenticate(req: any, options?: any): void;
  }
}
