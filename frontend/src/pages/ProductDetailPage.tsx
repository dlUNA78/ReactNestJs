import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GUEST_ID_KEY = 'guest_client_id';

// 1. Interfaces (actualizadas para incluir todas las imágenes)
interface IVariante {
  id_variante: number;
  sku: string;
  stock_disponible: number;
  imagen_url: string | null; // <-- Imagen de la variante
  talla: {
    id_talla: number;
    nombre_talla: string;
  };
}

interface IProductoDetalle {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: {
    id_categoria: number;
    nombre: string;
  };
  marca: {
    id_marca: number;
    nombre: string;
  };
  variantes: IVariante[];
  imagen_principal_url: string | null; // <-- Imagen principal
}

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [producto, setProducto] = useState<IProductoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<IVariante | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:3000/productos/${id}`,
        );
        setProducto(response.data);

        // Selecciona la primera variante disponible por defecto
        if (response.data.variantes && response.data.variantes.length > 0) {
          const firstAvailable = response.data.variantes.find(
            (v: IVariante) => v.stock_disponible > 0,
          );
          setSelectedVariant(firstAvailable || response.data.variantes[0]);
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError('Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleAddToCart = async () => {
    // ... (La lógica de 'handleAddToCart' no cambia)
    if (!selectedVariant) {
      setCartMessage('Por favor, selecciona una talla.');
      return;
    }
    const guestId = localStorage.getItem(GUEST_ID_KEY);
    if (!guestId) {
      setCartMessage('Error de sesión. Por favor, refresca la página.');
      console.error('No se encontró el guest_client_id');
      return;
    }
    setIsAdding(true);
    setCartMessage(null);
    try {
      await axios.post('http://localhost:3000/carrito-items', {
        cliente_id: Number(guestId),
        variante_id: selectedVariant.id_variante,
        cantidad: 1,
      });
      setCartMessage('¡Añadido al carrito exitosamente!');
      setTimeout(() => setCartMessage(null), 3000);
    } catch (err) {
      console.error('Error al añadir al carrito:', err);
      setCartMessage('Error al añadir al carrito. Intenta de nuevo.');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-600">{error}</div>;
  }

  if (!producto) {
    return <div className="container mx-auto p-8 text-center">Producto no encontrado.</div>;
  }

  // --- 2. Lógica de Imagen Principal ---
  // Determina qué imagen mostrar
  const displayImage = 
    selectedVariant?.imagen_url || // 1. La imagen de la variante seleccionada
    producto.imagen_principal_url || // 2. Si no hay, la imagen principal
    'https://via.placeholder.com/500'; // 3. Si no hay ninguna, el placeholder

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Columna de Imagen */}
        <div>
          {/* --- 3. IMAGEN ACTUALIZADA --- */}
          <img
            src={displayImage}
            alt={producto.nombre}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Columna de Detalles */}
        <div>
          <span className="text-sm text-gray-500">{producto.marca.nombre}</span>
          <h1 className="text-4xl font-bold mt-2">{producto.nombre}</h1>
          <p className="text-3xl font-light text-blue-600 mt-4">
            ${Number(producto.precio).toFixed(2)}
          </p>
          <p className="text-gray-700 mt-6">{producto.descripcion}</p>

          {/* Selector de Tallas (Variantes) */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Talla:</h3>
            <div className="flex flex-wrap gap-2">
              {producto.variantes?.map((variante) => (
                <button
                  key={variante.id_variante}
                  onClick={() => {
                    setSelectedVariant(variante); // <-- Esto cambia la imagen
                    setCartMessage(null);
                  }}
                  className={`
                    px-4 py-2 rounded-md border text-sm font-medium
                    ${selectedVariant?.id_variante === variante.id_variante
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                    }
                    ${variante.stock_disponible === 0
                      ? 'opacity-50 cursor-not-allowed line-through'
                      : ''
                    }
                  `}
                  disabled={variante.stock_disponible === 0}
                >
                  {variante.talla.nombre_talla}
                </button>
              ))}
            </div>
          </div>
          
          {/* Stock y Botón de Añadir (sin cambios) */}
          <div className="mt-8">
             {/* ... (Lógica de stock y botón 'Añadir al Carrito') ... */}
             {selectedVariant ? (
               <p className="text-sm text-gray-600 mb-4">
                 Stock disponible: {selectedVariant.stock_disponible}
               </p>
             ) : (
                <p className="text-sm text-red-600 mb-4">
                  Por favor, selecciona una talla disponible.
                </p>
             )}

            <button
              onClick={handleAddToCart}
              className={`
                w-full text-white font-bold py-3 px-6 rounded-lg shadow-md
                ${isAdding ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              disabled={
                !selectedVariant ||
                selectedVariant.stock_disponible === 0 ||
                isAdding
              }
            >
              {isAdding ? 'Añadiendo...' : 'Añadir al Carrito'}
            </button>

            {cartMessage && (
              <p
                className={`mt-4 text-sm font-medium ${
                  cartMessage.includes('Error')
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {cartMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};