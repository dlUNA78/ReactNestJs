import { useForm, type SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Interfaz para los datos del formulario
interface IAdminLoginInput {
    username: string;
    password_hash: string; // El nombre coincide con el DTO del backend
}

export const AdminLoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IAdminLoginInput>();
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    // 2. Función de envío
    const onSubmit: SubmitHandler<IAdminLoginInput> = async (data) => {
        setIsProcessing(true);
        setLoginError(null);
        try {
            const response = await axios.post(
                'http://localhost:3000/auth/admin-login',
                data,
            );

            // 3. Éxito: Guardamos los datos del admin y redirigimos
            // (En una app real, guardarías el Token JWT que te dio la API)
            localStorage.setItem('admin_user', JSON.stringify(response.data));

            // Redirigir al dashboard de admin (que crearemos)
            navigate('/admin/dashboard');

        } catch (err) {
            console.error('Error de login:', err);
            setLoginError('Credenciales inválidas. Intenta de nuevo.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
                <h1 className="mb-6 text-center text-3xl font-bold">
                    Admin Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register('username', { required: 'El username es requerido' })}
                            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password_hash', { required: 'La contraseña es requerida' })}
                            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.password_hash && (
                            <p className="mt-1 text-sm text-red-600">{errors.password_hash.message}</p>
                        )}
                    </div>

                    {loginError && (
                        <p className="text-center text-sm text-red-600">{loginError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isProcessing ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};