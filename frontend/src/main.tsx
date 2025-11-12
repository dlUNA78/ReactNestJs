import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Layouts
import App from './App.tsx';
import { AdminLayout } from './layouts/AdminLayout.tsx';

// --- Páginas de la Tienda ---
import { HomePage } from './pages/HomePage.tsx';
import { ProductsPage } from './pages/ProductsPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CarritoPage } from './pages/CarritoPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.tsx';

// --- Páginas de Admin ---
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { AdminProductsPage } from './pages/AdminProductsPage.tsx';
import { AdminProductFormPage } from './pages/AdminProductFormPage.tsx';
import { AdminOrdersPage } from './pages/AdminOrdersPage.tsx';
import { AdminUsersPage } from './pages/AdminUsersPage.tsx';
import { AdminUserFormPage } from './pages/AdminUserFormPage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminCategoriasPage } from './pages/AdminCategoriasPage.tsx';
import { AdminCategoriaFormPage } from './pages/AdminCategoriaFormPage.tsx';
import { AdminMarcasPage } from './pages/AdminMarcasPage.tsx';
import { AdminMarcaFormPage } from './pages/AdminMarcaFormPage.tsx';
import { AdminTallasPage } from './pages/AdminTallasPage.tsx';
import { AdminTallaFormPage } from './pages/AdminTallaFormPage.tsx';

const router = createBrowserRouter([
  // --- 1. Rutas de la Tienda (Usan el Layout 'App.tsx') ---
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/productos', element: <ProductsPage /> },
      { path: '/producto/:id', element: <ProductDetailPage /> },
      { path: '/carrito', element: <CarritoPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/orden-exitosa', element: <OrderSuccessPage /> },
    ],
  },

  // --- 2. Ruta de Login de Admin (Sin Layout) ---
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // --- 3. Rutas Protegidas de Admin (Usan el Layout 'AdminLayout.tsx') ---
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard', // Ruta completa: /admin/dashboard
        element: <AdminDashboardPage />,
      },
      {
        path: 'productos', // Ruta completa: /admin/productos
        element: <AdminProductsPage />,
      },
      {
        path: 'ordenes', // Ruta completa: /admin/ordenes
        element: <AdminOrdersPage />,
      },
      // (Descomentaremos esto cuando creemos el formulario)
      {
        path: 'productos/nuevo', // Ruta completa: /admin/productos/nuevo
        element: <AdminProductFormPage />,
      },
      {
        path: 'productos/editar/:id', // Ruta completa: /admin/productos/editar/1
        element: <AdminProductFormPage />,
      },
      {
        path: 'usuarios', // Ruta completa: /admin/usuarios
        element: <AdminUsersPage />,
      },
      { 
        path: 'usuarios/nuevo', // Ruta completa: /admin/usuarios/nuevo
        element: <AdminUserFormPage />,
      },
      {
        path: 'usuarios/editar/:id', // Ruta completa: /admin/usuarios/editar/1
        element: <AdminUserFormPage />,
      },
      {
        path: 'categorias', // Ruta completa: /admin/categorias
        element: <AdminCategoriasPage />,
      },
      {
        path: 'categorias/nuevo', // Ruta completa: /admin/categorias/nuevo
        element: <AdminCategoriaFormPage />,
      },
      {
        path: 'categorias/editar/:id', // Ruta completa: /admin/categorias/editar/1
        element: <AdminCategoriaFormPage />,
      },
      {
        path: 'marcas', // Ruta completa: /admin/marcas
        element: <AdminMarcasPage />,
      },
      {
        path: 'marcas/nuevo', // Ruta completa: /admin/marcas/nuevo
        element: <AdminMarcaFormPage />,
      },
      {
        path: 'marcas/editar/:id', // Ruta completa: /admin/marcas/editar/1
        element: <AdminMarcaFormPage />,
      },
      {
        path: 'tallas', // Ruta completa: /admin/tallas
        element: <AdminTallasPage />,
      },
      {
        path: 'tallas/nuevo', // Ruta completa: /admin/tallas/nuevo
        element: <AdminTallaFormPage />,
      },
      {
        path: 'tallas/editar/:id', // Ruta completa: /admin/tallas/editar/1
        element: <AdminTallaFormPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);