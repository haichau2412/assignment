interface FallbackBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function FallbackBoundary({
  error,
  resetErrorBoundary,
}: FallbackBoundaryProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}
