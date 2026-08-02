import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
export const createToken = (payload: { id: string; email: string }) => jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] });
