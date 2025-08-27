import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from "@/app/store.ts";
import { Provider } from 'react-redux'

import { HelmetProvider } from "react-helmet-async";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
  
  </StrictMode>,
)
