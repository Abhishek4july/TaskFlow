
'use client';

import { authenticatedFetch } from '../lib/api';
import { useState } from 'react';

type Task = {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
};

type EditTaskButtonProps = {
  task: Task;
  onTaskUpdated: () => void;
};

export default function EditTaskButton({
  task,
  onTaskUpdated,
}: EditTaskButtonProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await authenticatedFetch(
      `/tasks/${task.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
        }),
      },
    );

    if (!response.ok) {
      alert('Failed to update task');
      return;
    }

    alert('Task updated successfully!');

    setIsEditing(false);
    onTaskUpdated();
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="cursor-pointer rounded-lg bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-200"
      >
        Edit
      </button>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-3">
      <input
        className="w-full rounded-lg border p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full rounded-lg border p-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        className="w-full rounded-lg border p-2"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as Task['status'])
        }
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        className="w-full rounded-lg border p-2"
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as Task['priority'])
        }
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
        >
          Save
        </button>

        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="cursor-pointer rounded-lg bg-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
