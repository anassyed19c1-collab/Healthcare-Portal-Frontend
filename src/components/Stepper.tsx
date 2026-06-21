import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

const steps = ["Select Provider", "Select Date & Time", "Confirm"];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isDone || isActive
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isDone ? <Check size={16} /> : stepNum}
              </div>
              <span
                className={`text-sm font-semibold ${
                  isDone || isActive ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum !== steps.length && (
              <div
                className={`h-px w-24 mx-4 ${
                  isDone ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}