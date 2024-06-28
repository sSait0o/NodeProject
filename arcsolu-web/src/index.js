import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routesConfig } from './routes/routes'
import Modal from 'react-modal'
import './style/main.scss'
import './translate/translation'

const root = document.getElementById('root')
Modal.setAppElement(root)

createRoot(root).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {routesConfig.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  </React.StrictMode>
)
