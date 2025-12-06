import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Loader, AlertCircle } from "lucide-react";
import styles from "../styles/Psychologists.module.css";

export default function PsychologistsPage() {
  const { user, isAuthenticated } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/psychologists");
      setList(res.data);
    } catch (err) {
      setError("No pudimos cargar los psicólogos. Intenta más tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const specialties = ["Ansiedad", "Depresión", "Relaciones", "Estrés", "Autoestima"];
  
  const filteredList = filter === "all" 
    ? list 
    : list.filter(p => p.specialty?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Conoce a nuestros Psicólogos</h1>
        <p>Profesionales certificados dedicados a tu bienestar mental</p>
      </div>

      {/* Filtros */}
      <div className={styles.filterSection}>
        <h3>Filtrar por especialidad:</h3>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          {specialties.map(specialty => (
            <button
              key={specialty}
              className={`${styles.filterBtn} ${filter === specialty ? styles.active : ""}`}
              onClick={() => setFilter(specialty)}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinner} size={40} />
          <p>Cargando psicólogos...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={24} />
          <div>
            <h3>Algo salió mal</h3>
            <p>{error}</p>
            <button onClick={fetchPsychologists} className={styles.retryBtn}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}

      {/* Grid de Psicólogos */}
      {!loading && !error && (
        <>
          {filteredList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No hay psicólogos disponibles en esta categoría.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredList.map((psychologist) => (
                <div key={psychologist.id} className={styles.psychologistCard}>
                  {/* Avatar */}
                  <div className={styles.avatar}>
                    {psychologist.fullName.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className={styles.info}>
                    <h3>{psychologist.fullName}</h3>
                    <div className={styles.specialty}>
                      {psychologist.specialty || "Psicólogo Clínico"}
                    </div>
                    
                    {psychologist.bio && (
                      <p className={styles.bio}>{psychologist.bio}</p>
                    )}

                    {/* Stats */}
                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <span className={styles.label}>Experiencia</span>
                        <span className={styles.value}>5+ años</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.label}>Clientes</span>
                        <span className={styles.value}>150+</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    {isAuthenticated ? (
                      <Link href={`/psychologists/${psychologist.id}`}>
                        <button className={styles.ctaBtn}>
                          Ver horarios
                          <ArrowRight size={18} />
                        </button>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <button className={styles.ctaBtn}>
                          Inicia sesión para reservar
                          <ArrowRight size={18} />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
