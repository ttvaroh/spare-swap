import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthScreen from './pages/AuthScreen'
import Home from './pages/Home'
import './App.css'
import { AuthProvider } from '../context/AuthContext'
import CreateListing from './pages/CreateListing'
import MyItems from './pages/MyItems'
import Listing from './pages/Listing'
import ChatBot from './pages/ChatBot'
import Messages from './pages/Messages'
import EditListing from './pages/EditListing'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public auth routes - outside MainLayout */}
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/signin" element={<AuthScreen />} />
        
        {/* Protected routes - inside MainLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="create-listing" element={<CreateListing />} />
          <Route path="my-items" element={<MyItems />} />
          <Route path="messages" element={<Messages />} />
          <Route path="listing/:id" element={<Listing />} />
          <Route path="edit-listing/:id" element={<EditListing />} />
          <Route path="chatbot" element={<ChatBot />} />
          <Route path="*" element={<Home />} />
        </Route>
      </>
    )
  )

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App