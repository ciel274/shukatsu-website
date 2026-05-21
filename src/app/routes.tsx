import { createHashRouter } from 'react-router';
import RootLayout, { ErrorBoundary } from './layouts/RootLayout';

import LandingPage from './pages/LandingPage';
import InstallPage from './pages/InstallPage';

export const router = createHashRouter([
  {
    path: '/',
    Component: RootLayout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'install', element: <InstallPage /> },
    ],
  },
]);
