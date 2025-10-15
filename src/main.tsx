import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Cart from './pages/Cart.tsx';
import Products from './pages/Products.tsx';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import './Styles/index.css';


const router = createBrowserRouter([
  {
      path: '/',
      element: <Home />
  },
  {
      path: '/login',
      element: <Login />
  },
  {
      path: '/register',
      element: <Register />
  },
  {
      path: '/cart',
      element: <Cart />
  },
  {
      path: '/admin/products',
      element: <Products />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
