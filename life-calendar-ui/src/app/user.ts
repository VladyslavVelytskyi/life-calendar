export class User {
  private _fullName: string;
  private _email: string;
  private _password: string;
  private _birthday: string;

  constructor(
    {
      fullName,
      email,
      password,
      birthday
    }) {
      this._fullName = fullName;
      this._email = email;
      this._password = password;
      this._birthday = birthday;
  }
}
