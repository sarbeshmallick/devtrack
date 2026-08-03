import 'dotenv/config';

const required = ['DATABASE_URL', 'JWT_SECRET'] as const;
for (const key of required) if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);

export const env = {
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientUrls: (process.env.CLIENT_URLS ?? process.env.CLIENT_URL ?? 'http://localhost:5173')
    .split(',')
    .map(url => url.trim())
    .filter(Boolean),
};
