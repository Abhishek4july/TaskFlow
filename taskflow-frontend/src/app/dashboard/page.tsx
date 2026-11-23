
'use client';

import LogoutButton from '../components/LogoutButton';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateTaskForm from '../components/CreateTaskForm';
import DeleteTaskButton from '../components/DeleteTaskButton';
import EditTaskButton from '../components/EditTaskButton';
import { authenticatedFetch } from '../lib/api';

type Task = {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
};

export default function Home() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchTasks = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/tasks', {
        cache: 'no-store',
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Search and filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'ALL' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalTasks = tasks.length;

  const inProgress = tasks.filter(
    (task) => task.status === 'IN_PROGRESS',
  ).length;

  const completed = tasks.filter(
    (task) => task.status === 'DONE',
  ).length;

  if (loading) {
    return <p className="p-8">Loading tasks...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              TaskFlow
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your tasks and stay productive.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="cursor-pointer rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 hover:bg-blue-200"
            >
              My Profile
            </Link>

            <LogoutButton />
          </div>
        </header>

        <CreateTaskForm onTaskCreated={fetchTasks} />

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard title="Total Tasks" value={totalTasks} />
          <StatCard title="In Progress" value={inProgress} />
          <StatCard title="Completed" value={completed} />
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            My Tasks
          </h2>

          {/* Search and filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border p-3"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border p-3"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border p-3"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Task list */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <p className="text-slate-500">
                No matching tasks found.
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      {task.title}
                    </Link>

                    <p className="mt-1 text-sm text-slate-500">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {task.status}
                    </span>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {task.priority}
                    </span>

                    <EditTaskButton
                      task={task}
                      onTaskUpdated={fetchTasks}
                    />

                    <DeleteTaskButton
                      taskId={task.id}
                      onTaskDeleted={fetchTasks}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
