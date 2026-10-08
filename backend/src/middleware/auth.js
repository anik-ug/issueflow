import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new ApiError(401, 'Authentication required', 'UNAUTHENTICATED');
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select('-password');
    if (!user) throw new ApiError(401, 'Authentication required', 'UNAUTHENTICATED');
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid or expired session', 'UNAUTHENTICATED'));
  }
};
