import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import ProtectedRoute from './components/protectedRoutes'

import App from './App';
import RegisterScreen from './screens/registrationScreen';
import LoginScreen from './screens/loginScreen';
import ForgotPasswordScreen from './screens/forgotPasswordScreen';
import ShortenUrlPage from './screens/ShortenUrlPage'; 

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Default route */}
      <Route index={true} path='/' element={<LoginScreen/>} />
      
      {/* User routes */}
      <Route path="users">
        <Route path="RegisterScreen" element={<RegisterScreen />} />
        <Route path="LoginScreen" element={<LoginScreen />} />
        <Route path="ForgotPasswordScreen" element={<ForgotPasswordScreen />} />
        <Route path="ShortenUrlPage" element={<ProtectedRoute><ShortenUrlPage /></ProtectedRoute>}/>
      </Route>
    </Route>
  )
);

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
