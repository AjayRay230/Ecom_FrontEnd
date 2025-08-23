import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MyContext, { AppContextProvider } from './Context/MyContext.jsx'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
   <AppContextProvider>
    <StrictMode>
    <BrowserRouter>
     
        <App />
      
    </BrowserRouter>
  </StrictMode>
  </AppContextProvider>

)
