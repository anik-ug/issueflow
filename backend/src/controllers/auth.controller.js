import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cookieOptions, signToken } from '../utils/jwt.js';

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email });
const setSession = (res, user) => res.cookie('token', signToken(user._id.toString()), cookieOptions).json({ user: safeUser(user) });

export const register = asyncHandler(async (req, res) => {
  const exists = await User.exists({ email: req.body.email.toLowerCase() });
  if (exists) throw new ApiError(409, 'Email is already registered', 'EMAIL_TAKEN');
  const user = await User.create(req.body);
  setSession(res.status(201), user);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  setSession(res, user);
});

export const logout = (req, res) => res.clearCookie('token', cookieOptions).json({ message: 'Logged out' });
export const me = (req, res) => res.json({ user: safeUser(req.user) });
