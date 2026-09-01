import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import Index from './pages/Index'
import { Login } from './pages/Login'

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
          element={
            <MainLayout>
              <Index />
            </MainLayout>
          }
      />
      <Route path="/admin/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
