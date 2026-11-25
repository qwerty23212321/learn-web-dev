const STEPS = [1, 2, 3, 4, 5];

export function ProgressSteps({ currentStep = 3 }) {
  return (
    <section className="progress-section" aria-label="Прогресс записи">
      <div className="container">
        <p className="progress-label">ШАГ {currentStep} ИЗ {STEPS.length}</p>
        <ol className="stepper">
          {STEPS.map((stepNumber) => {
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const classes = ['step'];
            if (isCompleted) classes.push('step--completed');
            if (isCurrent) classes.push('step--current');

            return (
              <li
                key={stepNumber}
                className={classes.join(' ')}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="step-circle">{stepNumber}</span>
                <span className="step-line" aria-hidden="true" />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
