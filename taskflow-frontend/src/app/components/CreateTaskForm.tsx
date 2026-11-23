
'use client';

import { useState } from 'react';
import { authenticatedFetch } from '../lib/api';

type CreateTaskFormProps = {
  onTaskCreated: () => void;
};

export default function CreateTaskForm({
  onTaskCreated,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await authenticatedFetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
      }),
    });

    if (!response.ok) {
      alert('Failed to create task');
      return;
    }

    alert('Task created successfully!');

    setTitle('');
    setDescription('');
    setStatus('TODO');
    setPriority('MEDIUM');

    onTaskCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 space-y-4 rounded-xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">Create a Task</h2>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full rounded-lg border p-3"
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        className="w-full rounded-lg border p-3"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        className="w-full rounded-lg border p-3"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <button
        type="submit"
        className="rounded-lg cursor-pointer bg-blue-600 px-5 py-3 font-medium text-white"
      >
        Create Task
      </button>
    </form>
  );
}
