export class User {
  constructor(
    public email: string,
    private _token: string,
    public id: string,
    private _expireDate: Date
  ) {}
  get token() {
    if (new Date().getTime() > this._expireDate.getTime()) {
      return null;
    }
    return this._token;
  }
}
