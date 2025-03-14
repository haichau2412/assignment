import { Stepper as MuiStepper, Step, StepButton } from "@mui/material";
import { getText } from "../../i18n/en";
import { useState, useCallback, useRef } from "react";

interface Step {
  id: string;
}

interface StepperProps {
  steps: Step[];
  active: string;
  complete: string[];
  setActive: (id: string) => void;
  setComplete: (id: string) => void;
}

export const useStepper = ({ steps }: Pick<StepperProps, "steps">) => {
  const [active, setActive] = useState(steps[0].id);
  const [_complete, setComplete] = useState<string[]>([]);
  const completeRef = useRef(_complete);

  const _setComplete = useCallback((id: string) => {
    const complete = [...completeRef.current]
      .filter((d) => d !== id)
      .concat(id);
    completeRef.current = complete;
    console.log("complete", complete);
    setComplete(complete);
  }, []);

  const currentIndex = steps.findIndex((step) => step.id === active);
  const canMoveNext = currentIndex < steps.length - 1;
  const canMoveBack = currentIndex > 0;

  const moveNext = () => {
    if (canMoveNext) {
      setActive(steps[currentIndex + 1].id);
    }
  };

  const moveBack = () => {
    if (canMoveBack) {
      setActive(steps[currentIndex - 1].id);
    }
  };

  return {
    steps,
    setActive,
    active,
    complete: _complete,
    setComplete: _setComplete,
    canMoveNext,
    canMoveBack,
    moveNext,
    moveBack,
  };
};

export const Stepper = ({
  steps,
  setActive,
  active,
  complete,
}: StepperProps) => {
  const activeStep = steps.findIndex((step) => step.id === active);

  return (
    <MuiStepper
      nonLinear
      activeStep={activeStep}
      sx={{ marginY: "30px"}}
    >
      {steps.map((step) => (
        <Step key={step.id} completed={complete?.includes(step.id)}>
          <StepButton
            sx={{ padding: "5px" }}
            color="inherit"
            onClick={() => {
              setActive(step.id);
            }}
          >
            {getText(step.id) || step.id}
          </StepButton>
        </Step>
      ))}
    </MuiStepper>
  );
};

export default Stepper;
