namespace NodeJS {
  interface ProcessEnv {
    // Global
    URL: string;
    PORT: number;
    // DB
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
    EMAIL_TOKEN_SECRET: string;
    PHONE_TOKEN_SECRET: string;
  }
}
