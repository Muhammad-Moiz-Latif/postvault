import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router';
import { router } from '../src/routes';
import './index.css'


createRoot(document.getElementById('root')!).render(
  //Strict Mode enables the following development-only behaviors:

  // Your components will re-render an extra time to find bugs caused by impure rendering.
  // Your components will re-run Effects an extra time to find bugs caused by missing Effect cleanup.
  // Your components will re-run refs callbacks an extra time to find bugs caused by missing ref cleanup.
  // Your components will be checked for usage of deprecated APIs.
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
