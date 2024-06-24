export interface ResponseInterface {
  code?: number;
  data?: object;
  status: string;
  message?: string;
}

export interface IUser {
  id?: string;
  fullName: string;
  email: string;
  username?: string;
  phoneNumber: string;
  password: string;
  bvn: string;
}

export interface ILogin {
  emailPhone: string;
  password: string;
}

export interface IWallet {
  id?: string,
  userId?: string;
  amount?: number;
  action?: string;
  recipientId?: string;
  accountNumber?: string;
}



export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500
}
