
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '../lib/api';
import LogoutButton from '../components/LogoutButton';

type UserProfile = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await authenticatedFetch('/auth/profile', {
          cache: 'no-store',
        });

        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data: UserProfile = await response.json();
        setProfile(data);
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

    fetchProfile();
  }, [router]);

  if (loading) {
    return <p className="p-8">Loading profile...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl">

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Profile
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your account information.
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="rounded-xl bg-white p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {profile.name}
              </h2>
              <p className="text-sm text-slate-500">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="space-y-5 border-t pt-6">
            <div>
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="mt-1 font-medium text-slate-900">
                {profile.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="mt-1 font-medium text-slate-900">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">User ID</p>
              <p className="mt-1 font-medium text-slate-900">
                {profile.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Member Since</p>
              <p className="mt-1 font-medium text-slate-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="mt-8 cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </section>
      </div>
    </main>
  );
}
