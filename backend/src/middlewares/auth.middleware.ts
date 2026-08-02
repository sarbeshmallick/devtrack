import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const authenticate: RequestHandler = (req, _res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return next(new AppError(401, 'Authentication required.'));
  try { req.user = jwt.verify(token, env.jwtSecret) as { id: string; email: string }; next(); }
  catch { next(new AppError(401, 'Invalid or expired token.')); }
};
