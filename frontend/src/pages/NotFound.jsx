import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
        <h1 className="text-5xl font-bold text-indigo-400">404</h1>

        <p className="mt-4 text-xl font-semibold">Page Not Found</p>

        <p className="mt-2 text-slate-400">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;