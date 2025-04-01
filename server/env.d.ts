declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    JWT_SECRET_ACCESS: string;
    JWT_SECRET_REFRESH: string;
    IS_TS_NODE: string;
  }
}
