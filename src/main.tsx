import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from "@/app/store.ts";
import { Provider } from 'react-redux'
import { ThemeProvider } from './components/providers/theme-provider.tsx';
import { HelmetProvider } from "react-helmet-async";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light'>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </ThemeProvider>
  </StrictMode>,
)
