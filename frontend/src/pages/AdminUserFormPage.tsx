import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// 1. Interfaz para los Roles (del dropdown)
interface IRol {
  id_rol: number;
  nombre_rol: string;
}

// 2. Interfaz para el Formulario
interface IFormInput {
  nombre: string;
  username: string;
  password?: string; // Es opcional al editar
  role: number; // El DTO espera el ID del rol
}

export const AdminUserFormPage = () => {
  // --- 3. Setup ---
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  // Estados
  const [roles, setRoles] = useState<IRol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 4. Cargar datos (Roles y datos del User si se edita) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Cargar los roles para el dropdown
        const rolesRes = await axios.get('http://localhost:3000/roles');
        setRoles(rolesRes.data);

        // Si estamos en Modo Edición, cargar los datos del usuario
        if (isEditMode) {
          const userRes = await axios.get(
            `http://localhost:3000/usuarios-admin/${id}`,
          );
          // Mapeamos los datos para que coincidan con el formulario
          const userData = {
            ...userRes.data,
            // El API devuelve un objeto 'role', pero el form usa el ID
            role: userRes.data.role?.id_rol,
            password: '', // Dejamos la contraseña vacía
          };
          reset(userData); // Rellena el formulario
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditMode, reset]);

  // --- 5. Función de envío ---
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError(null);
    try {
      // Prepara el payload para la API
      // El DTO del backend espera 'password_hash'
      // CORRECCIÓN: El DTO espera 'id_rol_fk', no 'role'.
      const payload: any = {
        nombre: data.nombre,
        username: data.username,
        id_rol_fk: Number(data.role), // Mapea 'role' del form a 'id_rol_fk' del DTO
        password_hash: data.password, // Mapea 'password' a 'password_hash'
      };

      if (isEditMode && !payload.password_hash) {
        // Si estamos editando y la contraseña está vacía,
        // la eliminamos del payload para no sobrescribir el hash existente.
        delete payload.password_hash;
      }

      if (isEditMode) {
        // Modo Edición
        await axios.patch(`http://localhost:3000/usuarios-admin/${id}`, payload);
      } else {
        // Modo Creación
        await axios.post('http://localhost:3000/usuarios-admin', payload);
      }

      navigate('/admin/usuarios'); // Redirige a la lista
    } catch (err) {
      setError('Error al guardar el usuario. ¿Username duplicado?');
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  // --- 6. Renderizado del Formulario ---
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-4 text-red-600">{error}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            {...register('nombre', { required: 'El nombre es requerido' })}
            className="mt-1 w-full rounded-md border p-2"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            {...register('username', { required: 'El username es requerido' })}
            className="mt-1 w-full rounded-md border p-2"
          />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            {...register('password', {
              required: !isEditMode, // Requerida solo si se está creando
            })}
            placeholder={
              isEditMode ? 'Dejar en blanco para no cambiar' : 'Contraseña'
            }
            className="mt-1 w-full rounded-md border p-2"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            {...register('role', { required: 'El rol es requerido' })}
            className="mt-1 w-full rounded-md border bg-white p-2"
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre_rol}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            className="mr-4 rounded-lg bg-gray-500 px-6 py-2 text-white shadow hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
          >
            {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
};