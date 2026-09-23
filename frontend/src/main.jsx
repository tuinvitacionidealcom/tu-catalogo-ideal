import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App.jsx'
import overrideWindowAlert from './CustomAlert.js'
import './index.css'

overrideWindowAlert()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)
