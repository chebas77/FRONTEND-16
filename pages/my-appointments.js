import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { 
  Calendar, 
  Clock, 
  User, 
  Loader, 
  AlertCircle,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle
} from "lucide-react";
import styles from "../styles/MyAppointments.module.css";

export default function MyAppointments() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchAppointments();
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/appointments/mine");
      setAppointments(res.data || []);
    } catch (err) {
      setError("No pudimos cargar tus citas. Intenta más tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      return;
    }

    setCancelingId(appointmentId);
    try {
      await api.delete(`/appointments/${appointmentId}`);
      setAppointments(appointments.filter(a => a.id !== appointmentId));
    } catch (err) {
      setError("Error al cancelar la cita");
      console.error(err);
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'confirmed': { label: 'Confirmada', color: 'success' },
      'pending': { label: 'Pendiente', color: 'warning' },
      'cancelled': { label: 'Cancelada', color: 'error' },
      'completed': { label: 'Completada', color: 'success' }
    };
    
    return statusMap[status?.toLowerCase()] || { label: status, color: 'info' };
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'confirmed' || statusLower === 'completed') {
      return <CheckCircle size={16} />;
    }
    if (statusLower === 'cancelled') {
      return <XCircle size={16} />;
    }
    return <Clock size={16} />;
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.spinner} size={40} />
        <p>Cargando tus citas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          ← Volver al inicio
        </Link>
        <h1>Mis citas</h1>
        <p>Gestiona y visualiza tus consultas programadas</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {appointments.length === 0 && !error && (
        <div className={styles.emptyState}>
          <Calendar size={48} />
          <h2>No tienes citas programadas</h2>
          <p>¡Reserva una consulta con uno de nuestros psicólogos profesionales!</p>
          <Link href="/psychologists" className={styles.ctaLink}>
            Explorar psicólogos
          </Link>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length > 0 && (
        <div className={styles.appointmentsList}>
          {/* Tabs o filtros */}
          <div className={styles.tabsSection}>
            <p className={styles.tabInfo}>
              Total de citas: <strong>{appointments.length}</strong>
            </p>
          </div>

          {/* Grid de Citas */}
          <div className={styles.grid}>
            {appointments.map((appointment) => {
              const statusInfo = getStatusBadge(appointment.status);
              const isPast = new Date(appointment.date) < new Date();
              
              return (
                <div 
                  key={appointment.id} 
                  className={`${styles.appointmentCard} ${isPast ? styles.pastAppointment : ''}`}
                >
                  {/* Status Badge */}
                  <div className={`${styles.badge} ${styles[`badge_${statusInfo.color}`]}`}>
                    {getStatusIcon(appointment.status)}
                    <span>{statusInfo.label}</span>
                  </div>

                  {/* Psychologist Info */}
                  <div className={styles.psychologistInfo}>
                    <div className={styles.avatar}>
                      {appointment.Psychologist?.fullName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <h3>{appointment.Psychologist?.fullName || 'Psicólogo'}</h3>
                      <p className={styles.specialty}>
                        {appointment.Psychologist?.specialty || 'Especialista'}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <Calendar size={18} />
                      <div>
                        <span className={styles.label}>Fecha</span>
                        <span className={styles.value}>
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.detail}>
                      <Clock size={18} />
                      <div>
                        <span className={styles.label}>Hora</span>
                        <span className={styles.value}>{appointment.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isPast && appointment.status?.toLowerCase() === 'confirmed' && (
                    <div className={styles.actions}>
                      <button className={styles.editBtn}>
                        <Edit2 size={16} />
                        Reprogramar
                      </button>
                      <button 
                        className={styles.cancelBtn}
                        onClick={() => cancelAppointment(appointment.id)}
                        disabled={cancelingId === appointment.id}
                      >
                        {cancelingId === appointment.id ? (
                          <>
                            <Loader className={styles.spinner} size={16} />
                            Cancelando...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} />
                            Cancelar
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isPast && (
                    <div className={styles.pastNotice}>
                      <p>Esta consulta ya pasó</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
