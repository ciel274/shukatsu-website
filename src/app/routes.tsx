import { createHashRouter, Navigate } from 'react-router';
import RootLayout, { ErrorBoundary } from './layouts/RootLayout';
import SidebarLayout from './layouts/SidebarLayout';

// Stability: Reverting to standard imports to fix "Failed to fetch dynamically imported module" errors
import LandingPage from './pages/LandingPage';
import InstallPage from './pages/InstallPage';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import CompanyListPage from './pages/CompanyListPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import NotesPage from './pages/NotesPage';
import ProfilePage from './pages/ProfilePage';
import EntrySheetPage from './pages/EntrySheetPage';

export const router = createHashRouter([
  {
    path: '/',
    Component: SidebarLayout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/list" replace /> },
      { path: 'list', element: <CompanyListPage /> },
      { path: 'overview', element: <DashboardPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'es', element: <EntrySheetPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/landing',
    Component: RootLayout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'install', element: <InstallPage /> },
    ],
  },
]);
