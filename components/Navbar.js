import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Home, Calendar, Users } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🧠</span>
          <span className={styles.logoText}>MindCare</span>
        </Link>

        <button 
          className={styles.menuButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
          {isAuthenticated ? (
            <>
              <Link href="/" className={styles.navLink}>
                <Home size={18} />
                <span>Inicio</span>
              </Link>
              <Link href="/psychologists" className={styles.navLink}>
                <Users size={18} />
                <span>Psicólogos</span>
              </Link>
              <Link href="/my-appointments" className={styles.navLink}>
                <Calendar size={18} />
                <span>Mis citas</span>
              </Link>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.fullName}</span>
              </div>
              <button 
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Iniciar sesión
              </Link>
              <Link href="/register" className={styles.navLink}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
