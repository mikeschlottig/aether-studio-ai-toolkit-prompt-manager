import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { OverviewPage } from '@/pages/dashboard/OverviewPage'
import { AssistantPage } from '@/pages/dashboard/AssistantPage'
import { PromptLibraryPage } from '@/pages/dashboard/PromptLibraryPage'
import { ScriptLabPage } from '@/pages/dashboard/ScriptLabPage'
import { ToolForgePage } from '@/pages/dashboard/ToolForgePage'
import { SettingsPage } from '@/pages/dashboard/SettingsPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/app",
    element: <DashboardLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/app/overview" replace /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "assistant", element: <AssistantPage /> },
      { path: "prompts", element: <PromptLibraryPage /> },
      { path: "scripts", element: <ScriptLabPage /> },
      { path: "tools", element: <ToolForgePage /> },
      { path: "settings", element: <SettingsPage /> },
    ]
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)