import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya está logueado, redirigimos al home
  if (isAuthenticated && typeof window !== 'undefined') {
    router.push('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* Encabezado */}
          <div className={styles.header}>
            <div className={styles.logo}>🧠</div>
            <h1>MindCare</h1>
            <p>Tu bienestar mental es nuestra prioridad</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Input Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Correo electrónico
              </label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Botón Enviar */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <Loader className={styles.spinner} size={20} />
                  Ingresando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            {/* Footer - Registro */}
            <div className={styles.footer}>
              <p>
                ¿No tienes cuenta?{' '}
                <Link href="/register">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Decoración */}
        <div className={styles.decoration}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
          <div className={styles.blob3}></div>
        </div>
      </div>
    </div>
  );
}
