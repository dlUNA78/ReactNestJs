import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GUEST_ID_KEY = 'guest_client_id';

// 1. Definimos la interfaz (actualizada)
interface ICarritoItem {
  id_carrito_item: number;
  cantidad: number;
  variante: {
    id_variante: number;
    imagen_url: string | null; // <-- Imagen específica de la variante
    talla: {
      nombre_talla: string;
    };
    producto: {
      producto_id: number;
      nombre: string;
      precio: number;
      imagen_principal_url: string | null; // <-- Imagen principal del producto
    };
  };
}

export const CarritoPage = () => {
  const [items, setItems] = useState<ICarritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const guestId = localStorage.getItem(GUEST_ID_KEY);

  // Función para cargar los items del carrito
  const fetchCarritoItems = async () => {
    if (!guestId) {
      setError('No se pudo encontrar tu sesión. Refresca la página.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // La API ya devuelve variante, producto y talla anidados
      const response = await axios.get(
        `http://localhost:3000/carrito-items?clienteId=${guestId}`,
      );
      setItems(response.data);
    } catch (err) {
      console.error('Error al cargar carrito:', err);
      setError('No se pudo cargar el carrito.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarritoItems();
  }, [guestId]);

  // Función para eliminar un item del carrito
  const handleRemoveItem = async (itemId: number) => {
    try {
      await axios.delete(`http://localhost:3000/carrito-items/${itemId}`);
      fetchCarritoItems();
    } catch (err) {
      console.error('Error al eliminar item:', err);
      setError('Error al eliminar el producto del carrito.');
    }
  };

  // Calcular el total
  const totalPrice = items.reduce((total, item) => {
    return total + item.cantidad * Number(item.variante.producto.precio);
  }, 0);

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Cargando carrito...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>

      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Lista de Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id_carrito_item}
                className="flex items-center bg-white p-4 rounded-lg shadow-md gap-4"
              >
                {/* --- 2. LÓGICA DE IMAGEN ACTUALIZADA --- */}
                <img
                  src={
                    item.variante.imagen_url || // 1. Intenta la imagen de la variante
                    item.variante.producto.imagen_principal_url || // 2. Si no, la principal
                    'https://via.placeholder.com/100' // 3. Si no, el placeholder
                  }
                  alt={item.variante.producto.nombre}
                  className="w-24 h-24 rounded-md object-cover"
                />
                {/* ------------------------------------- */}
                
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">
                    {item.variante.producto.nombre}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Talla: {item.variante.talla?.nombre_talla || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.cantidad}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${(item.cantidad * Number(item.variante.producto.precio)).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id_carrito_item)}
                    className="text-sm text-red-500 hover:text-red-700 mt-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de Compra (sin cambios) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Resumen</h2>
              {/* ... (Subtotal, Envío, Total) ... */}
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-700">Envío</span>
                <span className="font-semibold">Gratis</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 text-center block"
              >
                Continuar con la Compra
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};