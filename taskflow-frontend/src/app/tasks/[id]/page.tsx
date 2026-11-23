'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authenticatedFetch } from '../../lib/api';

type Task = {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await authenticatedFetch(
          `/tasks/${taskId}`,
          { cache: 'no-store' },
        );

        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Task not found');
        }

        const data: Task = await response.json();
        setTask(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [taskId, router]);

  if (loading) {
    return <p className="p-8">Loading task details...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  if (!task) return null;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 cursor-pointer text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <section className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">
            {task.title}
          </h1>

          <div className="mb-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {task.status}
            </span>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
              {task.priority} PRIORITY
            </span>
          </div>

          <div className="border-t pt-6">
            <h2 className="mb-2 text-lg font-semibold">
              Description
            </h2>

            <p className="text-slate-600">
              {task.description}
            </p>
          </div>

          <div className="mt-8 space-y-5 border-t pt-6">
            <div>
              <p className="text-sm text-slate-500">Task ID</p>
              <p className="font-medium">{task.id}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Created At</p>
              <p className="font-medium">
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Last Updated</p>
              <p className="font-medium">
                {new Date(task.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}