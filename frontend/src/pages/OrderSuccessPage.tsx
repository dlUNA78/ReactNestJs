import { Link } from 'react-router-dom';

export const OrderSuccessPage = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        ¡Gracias por tu compra!
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Tu orden ha sido registrada exitosamente.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700"
      >
        Volver a la página principal
      </Link>
    </div>
  );
};