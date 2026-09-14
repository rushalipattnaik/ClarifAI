import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-2xl font-bold text-indigo-400">
        ClarifAI
      </Link>

      <div className="flex items-center gap-4">
        {/* About */}
        <a
          href="/#features"
          className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:bg-slate-800"
        >
          About
        </a>

        {isAuthenticated ? (
          <>
            {/* History */}
            <Link
              to="/history"
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:bg-slate-800"
            >
              History
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Sign In */}
            <Link
              to="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition hover:bg-slate-800"
            >
              Sign In
            </Link>

            {/* Sign Up */}
            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* GitHub */}
        <a
          href="https://github.com/rushalipattnaik"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
