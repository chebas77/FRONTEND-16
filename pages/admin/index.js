import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import styles from "../../styles/AdminDashboard.module.css";

export default function AdminIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Panel de Administración</h1>
      <div className={styles.grid}>
        <Link href="/admin/psychologists" className={styles.card}>
          <div className={styles.cardIcon}>👨‍⚕️</div>
          <div className={styles.cardTitle}>Gestión de Psicólogos</div>
          <div className={styles.cardDesc}>Crear, editar y eliminar psicólogos</div>
        </Link>

        <Link href="/admin/appointments" className={styles.card}>
          <div className={styles.cardIcon}>📅</div>
          <div className={styles.cardTitle}>Todas las Citas</div>
          <div className={styles.cardDesc}>Ver y administrar citas reservadas</div>
        </Link>
      </div>
    </div>
  );
}