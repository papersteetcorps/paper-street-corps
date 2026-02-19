"use client";

import Button from "@/components/ui/Button";

interface WizardNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function WizardNavigation({
  canGoBack,
  canGoNext,
  isLast,
  onBack,
  onNext,
  onSubmit,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <div>
        {canGoBack && (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        )}
      </div>
      <div>
        {isLast ? (
          <Button onClick={onSubmit} disabled={!canGoNext}>
            Submit
          </Button>
        ) : (
          <Button onClick={onNext} disabled={!canGoNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
