import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => next(new ApiError(404, 'Route not found', 'NOT_FOUND'));

export const errorHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: error.flatten() } });
  }
  const status = error.status || (error.name === 'CastError' ? 400 : 500);
  const code = error.code || (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  if (status === 500) console.error(error);
  return res.status(status).json({ error: { message: status === 500 ? 'Internal server error' : error.message, code, ...(error.details && { details: error.details }) } });
};
