function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
      <p>
        Built with FastAPI, React and Google Gemini.
      </p>

      <p className="mt-1">
        <a
          href="https://github.com/rushalipattnaik/clarifAI"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 transition hover:text-indigo-300"
        >
          View source on GitHub
        </a>
      </p>
    </footer>
  );
}

export default Footer;