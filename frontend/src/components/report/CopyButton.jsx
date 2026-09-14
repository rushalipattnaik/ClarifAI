import { useToast } from "../../hooks/useToast";

function CopyButton({ report }) {
  const { showToast } = useToast();

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report);

      showToast("Report copied to clipboard.");
    } catch (error) {
      console.error("Copy failed:", error);

      showToast("Unable to copy the report.", "error");
    }
  }

  return (
    <button
      onClick={copyReport}
      className="rounded-lg bg-indigo-600 px-5 py-2 hover:bg-indigo-500"
    >
      📋 Copy
    </button>
  );
}

export default CopyButton;