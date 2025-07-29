import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { Provider } from "@/components/ui/provider"
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Provider>
  </StrictMode>,
)
