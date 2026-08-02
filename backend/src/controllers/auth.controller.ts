import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createToken } from '../utils/token.js';

const credentials = z.object({ email: z.string().email().transform(v => v.toLowerCase()), password: z.string().min(8) });
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = credentials.extend({ name: z.string().min(2).max(80) }).parse(req.body);
  if (await prisma.user.findUnique({ where: { email } })) throw new AppError(409, 'An account with this email already exists.');
  const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) }, select: { id: true, name: true, email: true, createdAt: true } });
  res.status(201).json({ user, token: createToken(user) });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = credentials.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError(401, 'Invalid email or password.');
  const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  res.json({ user: safeUser, token: createToken(safeUser) });
});
export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, name: true, email: true, createdAt: true } });
  if (!user) throw new AppError(404, 'User not found.'); res.json({ user });
});
