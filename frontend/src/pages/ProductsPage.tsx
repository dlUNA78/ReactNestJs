import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ICategoriaLite {
  id_categoria: number;
  nombre: string;
}

interface IMarcaLite {
  id_marca: number;
  nombre: string;
}

interface IProducto {
  producto_id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: ICategoriaLite;
  marca: IMarcaLite;
  imagen_principal_url: string | null;
}

export const ProductsPage = () => {
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:3000/productos');
        setProductos(response.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        if (axios.isAxiosError(err)) {
          setError(`Error: ${err.message}`);
        } else {
          setError('Ocurrió un error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = productos
    .filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.marca?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.precio - b.precio;
        case 'category':
          return (a.categoria?.nombre || '').localeCompare(b.categoria?.nombre || '');
        case 'name':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Cargando productos...</p>
          <p className="text-sm text-gray-500 mt-2">Preparando el catálogo para ti</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar productos</h2>
          <p className="text-red-500 bg-red-50 p-4 rounded-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
              <p className="text-lg text-gray-600">
                Descubre nuestra colección exclusiva ({productos.length} productos)
              </p>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Ordenar por nombre</option>
                <option value="price">Ordenar por precio</option>
                <option value="category">Ordenar por categoría</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            {/* ... (Placeholder 'No se encontraron productos') ... */}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="flex justify-between items-center mb-8">
              {/* ... (Info 'Mostrando ...') ... */}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((producto) => (
                <div
                  key={producto.producto_id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden group"
                >
                  {/* --- BLOQUE DE IMAGEN CORREGIDO --- */}
                  <Link to={`/producto/${producto.producto_id}`} className="block relative overflow-hidden">
                    <div className="aspect-square bg-gray-100">
                      <img
                        // 1. Usa la URL principal, o el placeholder si es null
                        src={producto.imagen_principal_url || '/placeholder.jpg'}
                        alt={producto.nombre}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        
                        // 2. Si la URL principal (de la DB) falla (404), la cambia al placeholder
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Previene bucles infinitos de error
                          target.src = '/placeholder.jpg'; // URL del placeholder genérico
                        }}
                      />
                    </div>
                    
                    {/* Stock Badge (sin cambios) */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                      producto.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : producto.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {producto.stock > 10 ? 'En stock' : producto.stock > 0 ? 'Poco stock' : 'Agotado'}
                    </div>

                    {/* Overlay (sin cambios) */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </Link>

                  {/* Product Info (sin cambios) */}
                  <div className="p-6">
                    {/* ... (Categoría, Marca, Nombre, Precio, Botón) ... */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {producto.categoria?.nombre || 'Sin categoría'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {producto.marca?.nombre || 'Sin marca'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {producto.nombre}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ${Number(producto.precio).toFixed(2)}
                      </p>
                      <Link
                        to={`/producto/${producto.producto_id}`}
                        className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-110 shadow-lg"
                        title="Ver detalles"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Navigation (sin cambios) */}
      <div className="bg-white border-t mt-16">
        {/* ... (Footer quick nav) ... */}
      </div>
    </div>
  );
};