
'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('access_token');

    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}
