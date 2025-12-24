import { Offering } from "@/data/offerings";

export default function Card({ offering }: { offering: Offering }) {
  const isTest = offering.category === "test";

  return (
    <div className="border border-neutral-800 p-5 flex flex-col justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          {isTest ? "Interactive Test" : "Theory"}
        </div>

        <h3 className="mt-2 text-lg font-medium">
          {offering.title}
        </h3>

        <p className="mt-2 text-sm text-neutral-400">
          {offering.description}
        </p>
      </div>

      <a
        href={offering.href}
        className="mt-4 text-sm text-neutral-300 hover:text-white"
      >
        {isTest ? "Take Test →" : "Learn More →"}
      </a>
    </div>
  );
}
