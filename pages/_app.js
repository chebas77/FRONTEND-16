import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Páginas sin navbar
  const noNavbarPages = ['/login', '/register'];
  const showNavbar = !noNavbarPages.includes(router.pathname);

  return (
    <AuthProvider>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
