import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg">

        <h1 className="mb-4 text-5xl font-bold text-blue-600">
          TaskFlow
        </h1>

        <h2 className="mb-4 text-3xl font-bold text-slate-900">
          Manage your tasks. Stay productive.
        </h2>

        <p className="mb-8 text-slate-500">
          Organize your work, track your progress, and
          accomplish more every day with TaskFlow.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-blue-600 px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Create Account
          </Link>

        </div>

      </div>
    </main>
  );
}