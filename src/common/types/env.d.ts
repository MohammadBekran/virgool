namespace NodeJS {
  interface ProcessEnv {
    // DB
    PORT: number;
    DB_HOST: string;
    DB_NAME: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    // Secrets
    COOKIE_SECRET: string;
    OTP_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
