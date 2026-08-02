import { ProjectRole } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import { AppError } from '../utils/AppError.js';

export async function getMembership(projectId: string, userId: string) {
  const member = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId, projectId } } });
  if (!member) throw new AppError(403, 'You are not a member of this project.');
  return member;
}
export async function requireAdmin(projectId: string, userId: string) {
  const member = await getMembership(projectId, userId);
  if (member.role !== ProjectRole.ADMIN) throw new AppError(403, 'Project admin access required.');
  return member;
}
export const taskInclude = { assignedUser: { select: { id: true, name: true, email: true } }, comments: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: 'asc' as const } } };
