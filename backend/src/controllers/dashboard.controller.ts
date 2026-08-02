import { TaskStatus } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getDashboard = asyncHandler(async (req, res) => {
  const projectFilter = { members: { some: { userId: req.user!.id } } }; const taskFilter = { project: projectFilter };
  const now = new Date();
  const [totalProjects, totalTasks, completedTasks, overdueTasks, recentTasks, statusGroups] = await Promise.all([
    prisma.project.count({ where: projectFilter }), prisma.task.count({ where: taskFilter }), prisma.task.count({ where: { ...taskFilter, status: TaskStatus.DONE } }), prisma.task.count({ where: { ...taskFilter, dueDate: { lt: now }, status: { not: TaskStatus.DONE } } }),
    prisma.task.findMany({ where: taskFilter, take: 6, orderBy: { updatedAt: 'desc' }, include: { project: { select: { id: true, name: true } }, assignedUser: { select: { id: true, name: true } } } }),
    prisma.task.groupBy({ by: ['status'], where: taskFilter, _count: { _all: true } }),
  ]);
  res.json({ stats: { totalProjects, totalTasks, completedTasks, pendingTasks: totalTasks - completedTasks, overdueTasks }, recentTasks, statusGroups });
});
