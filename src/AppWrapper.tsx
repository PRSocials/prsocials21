import { Suspense } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Head } from "./internal-components/Head";
import { ThemeProvider } from "./internal-components/ThemeProvider";
import { DEFAULT_THEME } from "./constants/default-theme";

export const AppWrapper = () => {
  return (
    <ThemeProvider defaultTheme={DEFAULT_THEME}>
      <ErrorBoundary
        fallback={null}
        onError={(error) => {
          console.error(
            "Caught error in AppWrapper",
            error.message,
            error.stack,
          );
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
          <Head />
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
};