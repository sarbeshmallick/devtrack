import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const updateProfile = asyncHandler(async (req, res) => {
  const data = z.object({ name: z.string().min(2).max(80) }).parse(req.body);
  const user = await prisma.user.update({ where: { id: req.user!.id }, data, select: { id: true, name: true, email: true, createdAt: true } });
  res.json({ user });
});
