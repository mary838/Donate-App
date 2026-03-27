import React from "react";

interface Step {
  id: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    id: "01",
    title: "Create an Account",
    desc: "Join our community by creating a simple profile.",
  },
  {
    id: "02",
    title: "List or Browse Items",
    desc: "Post items you want to give or find things you need.",
  },
  {
    id: "03",
    title: "Connect & Schedule",
    desc: "Message directly and set a pickup or drop-off time.",
  },
  {
    id: "04",
    title: "Make an Impact",
    desc: "Help the environment and someone in your community.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 px-10 text-center">
      <h4 className="text-[#B33D11] font-bold mb-2 uppercase tracking-widest text-sm">
        How it works
      </h4>
      <h2 className="text-4xl font-bold mb-16 italic">Four Simple Steps</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {steps.map((step: Step) => (
          <div key={step.id} className="space-y-4">
            <span className="text-5xl font-extrabold text-[#B33D11]/10 block">
              {step.id}
            </span>
            <h3 className="font-bold text-xl">{step.title}</h3>
            <p className="text-gray-500 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
