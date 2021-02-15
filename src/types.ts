export interface Session {
  id?: string;
  user: string;
  scopes: readonly string[];
  readonly created: number;
}

export interface Handshake {
  id?: string;

  code?: string;
  user?: string;

  readonly redirect: string;
  readonly scopes: string[];
  readonly created: number;
}

export interface MasterKey {
  id?: string;

  readonly user: string;
  readonly name: string;
}

export interface User {
  id?: string;
  readonly username: string;
  pass: string;
  salt: string;
}

export interface Config {
  readonly sessionExpTime: number;
  readonly handshakeExpTime: number;
  readonly whitelist?: string[];
}
