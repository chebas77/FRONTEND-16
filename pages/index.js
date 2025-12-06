import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Users, 
  Calendar, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Heart size={18} />
            <span>Tu salud mental importa</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            Reserva consultas con psicólogos profesionales
          </h1>
          
          <p className={styles.heroDescription}>
            Accede a cuidado mental de calidad desde la comodidad de tu hogar. 
            Conecta con especialistas certificados en diversos campos de la psicología.
          </p>

          <div className={styles.heroCTA}>
            {!isAuthenticated ? (
              <>
                <Link href="/register">
                  <button className={styles.btnPrimary}>
                    Comenzar ahora
                    <ArrowRight size={20} />
                  </button>
                </Link>
                <Link href="/login">
                  <button className={styles.btnSecondary}>
                    Ya tengo cuenta
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/psychologists">
                  <button className={styles.btnPrimary}>
                    Explorar psicólogos
                    <ArrowRight size={20} />
                  </button>
                </Link>
                <Link href="/my-appointments">
                  <button className={styles.btnSecondary}>
                    Ver mis citas
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hero Stats */}
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <TrendingUp size={20} />
              <span>500+ usuarios activos</span>
            </div>
            <div className={styles.stat}>
              <Users size={20} />
              <span>50+ psicólogos certificados</span>
            </div>
            <div className={styles.stat}>
              <Star size={20} />
              <span>4.9/5 calificación</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className={styles.heroIllustration}>
          <div className={styles.blob}></div>
          <div className={styles.iconContainer}>🧠</div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>¿Por qué elegirnos?</h2>
        <p className={styles.sectionSubtitle}>
          Ofrecemos una experiencia moderna y segura para tu bienestar mental
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Calendar size={32} />
            </div>
            <h3>Reserva fácil</h3>
            <p>
              Agenda tus consultas en minutos. Visualiza disponibilidad en tiempo real 
              y elige el horario que mejor se adapte a tu rutina.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Users size={32} />
            </div>
            <h3>Especialistas expertos</h3>
            <p>
              Accede a psicólogos certificados con años de experiencia en diferentes 
              áreas de la psicología clínica y bienestar.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Shield size={32} />
            </div>
            <h3>Privacidad garantizada</h3>
            <p>
              Tu información está protegida con los más altos estándares de seguridad. 
              Completa confidencialidad en todas tus consultas.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Heart size={32} />
            </div>
            <h3>Enfoque holístico</h3>
            <p>
              Somos parte de tu camino hacia el bienestar. Nuestros profesionales 
              están comprometidos con tu salud mental.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2>¿Cómo funciona?</h2>
        <p className={styles.sectionSubtitle}>
          Tres pasos sencillos para tu primera consulta
        </p>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Registra tu cuenta</h3>
            <p>Crea tu perfil en minutos con tu correo y contraseña</p>
          </div>

          <div className={styles.stepArrow}><ArrowRight size={32} /></div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Explora psicólogos</h3>
            <p>Conoce a nuestros especialistas y sus áreas de expertise</p>
          </div>

          <div className={styles.stepArrow}><ArrowRight size={32} /></div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Reserva tu cita</h3>
            <p>Selecciona fecha y hora que se adapte a tu disponibilidad</p>
          </div>
        </div>
      </section>

      {/* User Info Section */}
      {isAuthenticated && (
        <section className={styles.userSection}>
          <div className={styles.userCard}>
            <div className={styles.userGreeting}>
              <div className={styles.userAvatar}>
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2>¡Bienvenido/a, {user?.fullName}!</h2>
                <p>Has iniciado sesión correctamente</p>
              </div>
            </div>

            <div className={styles.userNavigation}>
              <Link href="/psychologists" className={styles.navCard}>
                <Users size={24} />
                <div>
                  <h3>Explorar psicólogos</h3>
                  <p>Descubre y reserva con especialistas</p>
                </div>
                <ArrowRight size={20} />
              </Link>

              <Link href="/my-appointments" className={styles.navCard}>
                <Calendar size={24} />
                <div>
                  <h3>Mis citas</h3>
                  <p>Visualiza tus consultas programadas</p>
                </div>
                <ArrowRight size={20} />
              </Link>

              {user?.role === 'ADMIN' && (
                <Link href="/admin/psychologists" className={styles.navCard}>
                  <Shield size={24} />
                  <div>
                    <h3>Panel administrativo</h3>
                    <p>Gestiona psicólogos y citas</p>
                  </div>
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>

            <button 
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              Cerrar sesión
            </button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className={styles.ctaSection}>
          <h2>Empieza tu camino hacia el bienestar hoy</h2>
          <p>
            Únete a cientos de usuarios que ya están mejorando su salud mental con nosotros
          </p>
          <Link href="/register">
            <button className={styles.btnLarge}>
              Crear mi cuenta gratis
              <ArrowRight size={22} />
            </button>
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <span className={styles.logo}>🧠</span>
            <span className={styles.brandName}>MindCare</span>
          </div>
          <p>Cuidamos tu bienestar mental con profesionalismo y compasión</p>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 MindCare. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
