export interface IGetToken {
  name: string;
  email: string;
  picture: string;
  sub: string;
  accessToken: string;
  user: IUserGetToken;
  iat: number;
  exp: number;
  jti: string;
}

export interface IUserGetToken {
  id: string;
  name: string;
  email: string;
  role: string;
}
