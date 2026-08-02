export type Role = 'ADMIN' | 'MEMBER'; export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'; export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export interface User { id: string; name: string; email: string; createdAt?: string }
export interface Comment { id: string; content: string; createdAt: string; authorId: string; author: Pick<User, 'id' | 'name'> }
export interface Task { id: string; title: string; description?: string | null; priority: Priority; status: TaskStatus; dueDate?: string | null; position: number; createdAt: string; updatedAt: string; projectId: string; assignedUserId?: string | null; assignedUser?: User | null; comments?: Comment[]; project?: { id: string; name: string } }
export interface Member { id: string; role: Role; userId: string; user: User }
export interface Project { id: string; name: string; description?: string | null; createdAt: string; updatedAt: string; members?: Member[]; tasks?: Task[]; _count?: { tasks: number } }
export interface Dashboard { stats: { totalProjects: number; totalTasks: number; completedTasks: number; pendingTasks: number; overdueTasks: number }; recentTasks: Task[]; statusGroups: { status: TaskStatus; _count: { _all: number } }[] }
