import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthScreen from './pages/AuthScreen'
import Home from './pages/Home'
import './App.css'
import { AuthProvider } from './lib/AuthContext'
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
      <Route path="/" element={<MainLayout />}>
        <Route index element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="auth" element={<AuthScreen />} />
        <Route path="signin" element={<AuthScreen />} />
        <Route path="create-listing" element={
          <ProtectedRoute>
            <CreateListing />
          </ProtectedRoute>
        } />
        <Route path="my-items" element={
          <ProtectedRoute>
            <MyItems />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="listing/:id" element={<Listing />} />
        <Route path="edit-listing/:id" element={
          <ProtectedRoute>
            <EditListing />
          </ProtectedRoute>
        } />
        <Route path="chatbot" element={
          <ProtectedRoute>
            <ChatBot />
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Route>
    )
  )

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App