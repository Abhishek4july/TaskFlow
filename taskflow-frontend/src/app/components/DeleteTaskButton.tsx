
'use client';

import { authenticatedFetch } from '../lib/api';

type DeleteTaskButtonProps = {
  taskId: number;
  onTaskDeleted: () => void;
};

export default function DeleteTaskButton({
  taskId,
  onTaskDeleted,
}: DeleteTaskButtonProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?',
    );

    if (!confirmed) return;

    const response = await authenticatedFetch(
      `/tasks/${taskId}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      alert('Failed to delete task');
      return;
    }

    alert('Task deleted successfully!');

    onTaskDeleted();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg cursor-pointer bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
    >
      Delete
    </button>
  );
}
