export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }
  return {
    message: "Internal server error",
    statusCode: 500,
  };
}

// Global error boundary (stub)
export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return children;
}
