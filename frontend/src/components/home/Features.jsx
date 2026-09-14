import { CheckCircle } from "lucide-react";

const features = [
  "Functional Requirements",
  "User Stories",
  "Acceptance Criteria",
  "REST API Suggestions",
  "Database Design",
  "MVP Planning",
];

function Features() {
  return (
    <section
      id="features"
      className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 scroll-mt-24"
    >
      {features.map((feature) => (
        <div
          key={feature}
          className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <CheckCircle className="text-cyan-400" />
          <span className="text-white">{feature}</span>
        </div>
      ))}
    </section>
  );
}

export default Features;