import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadIndex, setReloadIndex] = useState(0);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Unknown date";
    }

    const date = new Date(timestamp.replace(" ", "T"));

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await api.get("/reports/");

        if (!cancelled) {
          setReports(response.data.reports || []);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load reports:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              "We couldn't load your reports right now."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadIndex]);

  function retry() {
    setLoading(true);
    setReloadIndex((current) => current + 1);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-700 border-t-indigo-500">
            <span className="text-lg">AI</span>
          </div>

          <h2 className="text-xl font-semibold">Loading your reports</h2>

          <p className="mt-2 text-sm text-slate-400">
            Retrieving your saved SRS documents...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Report History</h1>

            <p className="mt-2 text-slate-400">
              Access your previously generated SRS reports.
            </p>
          </div>

          <Link
            to="/questions"
            className="rounded-lg bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-500"
          >
            + New Report
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-red-900/70 bg-red-950/30 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-red-300">
                  Unable to load reports
                </h2>

                <p className="mt-2 text-sm text-red-400">{error}</p>
              </div>

              <button
                onClick={retry}
                className="rounded-lg bg-red-700 px-5 py-2.5 font-medium transition hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!error && reports.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-10 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-2xl">
              📄
            </div>

            <h2 className="mt-6 text-2xl font-bold">No reports yet</h2>

            <p className="mx-auto mt-3 max-w-md text-slate-400">
              Turn your project idea into a professional Software
              Requirements Specification with ClarifAI.
            </p>

            <Link
              to="/questions"
              className="mt-7 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
            >
              Create Your First Report
            </Link>
          </div>
        )}

        {!error && reports.length > 0 && (
          <div className="mt-10 space-y-5">
            {reports.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg transition hover:border-indigo-500/50 hover:bg-slate-900/80"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold text-white">
                      {item.project}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-indigo-400">
                      Software Requirements Specification
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Generated {formatTimestamp(item.created_at)}
                    </p>
                  </div>

                  <Link
                    to={`/reports/${item.id}`}
                    className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2.5 text-center font-medium transition hover:bg-indigo-500"
                  >
                    Open Report →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportHistory;