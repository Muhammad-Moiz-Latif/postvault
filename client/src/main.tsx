import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router';
import { router } from '../src/routes';
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/authContext';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster
        position="top-center"
        closeButton
        richColors
        expand={false}
        duration={2500}
        toastOptions={{
          style: {
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>,
);
