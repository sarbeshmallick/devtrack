import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const notFound: RequestHandler = (req, _res, next) => next(new AppError(404, `Route ${req.method} ${req.path} was not found.`));
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) { res.status(400).json({ message: 'Invalid request data.', errors: error.flatten() }); return; }
  const status = error instanceof AppError ? error.statusCode : 500;
  if (status === 500) console.error(error);
  res.status(status).json({ message: error instanceof AppError ? error.message : 'Internal server error.' });
};
