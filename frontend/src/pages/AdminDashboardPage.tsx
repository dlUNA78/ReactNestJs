export const AdminDashboardPage = () => {
  // 1. Obtenemos el nombre del localStorage para personalizar
  const userJson = localStorage.getItem('admin_user');
  let adminNombre = 'Admin';
  if (userJson) {
    adminNombre = (JSON.parse(userJson) as { nombre: string }).nombre;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        ¡Bienvenido, {adminNombre}!
      </h1>
      <p className="text-lg">
        Selecciona una opción del menú lateral para comenzar a gestionar tu tienda.
      </p>
      
      {/* Aquí podrías añadir tarjetas de resumen (ej. "Total de Órdenes", "Nuevos Clientes") */}
    </div>
  );
};