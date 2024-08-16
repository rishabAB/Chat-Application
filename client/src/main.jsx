import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'

import {BrowserRouter} from 'react-router-dom';
import {AuthContextProvider} from './context/authContext';
ReactDOM.createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
    </BrowserRouter>
   
 
)
// Here strictMode triggers react hooks more than once in development mode so removing it temporarily