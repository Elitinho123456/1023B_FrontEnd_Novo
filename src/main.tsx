import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home.tsx';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import './Styles/index.css';


const router = createBrowserRouter([
  {
      path: '/',
      element: <Home />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
