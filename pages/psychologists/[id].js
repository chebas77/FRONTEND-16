import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Loader, 
  AlertCircle,
  CheckCircle 
} from "lucide-react";
import styles from "../../styles/PsychologistDetail.module.css";

export default function PsychologistDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [psychologist, setPsychologist] = useState(null);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    fetchPsychologist();
  }, [id]);

  const fetchPsychologist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/psychologists/${id}`);
      setPsychologist(res.data);
    } catch (err) {
      setError("No pudimos cargar la información del psicólogo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!date) {
      setError("Por favor selecciona una fecha");
      return;
    }

    setCheckingAvailability(true);
    setError(null);
    setAvailable([]);
    
    try {
      const res = await api.get(`/psychologists/${id}/available-times?date=${date}`);
      setAvailable(res.data.availableTimes || []);
      if (res.data.availableTimes?.length === 0) {
        setError("No hay horarios disponibles para esta fecha");
      }
    } catch (err) {
      setError("Error al buscar disponibilidad");
      console.error(err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const bookAppointment = async () => {
    if (!selectedTime) {
      setError("Por favor selecciona un horario");
      return;
    }

    setBooking(true);
    setError(null);
    
    try {
      await api.post("/appointments", {
        psychologistId: Number(id),
        date,
        time: selectedTime
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/my-appointments");
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al reservar la cita");
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.spinner} size={40} />
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!psychologist) {
    return (
      <div className={styles.container}>
        <Link href="/psychologists" className={styles.backLink}>
          <ArrowLeft size={20} />
          Volver a psicólogos
        </Link>
        <div className={styles.errorAlert}>
          <AlertCircle size={24} />
          <div>
            <h3>Psicólogo no encontrado</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <Link href="/psychologists" className={styles.backLink}>
        <ArrowLeft size={20} />
        Volver a psicólogos
      </Link>

      <div className={styles.content}>
        {/* Left Column - Información */}
        <div className={styles.leftColumn}>
          <div className={styles.profileCard}>
            {/* Avatar */}
            <div className={styles.avatar}>
              {psychologist.fullName.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <h1>{psychologist.fullName}</h1>
            <p className={styles.specialty}>{psychologist.specialty || "Psicólogo Clínico"}</p>

            {psychologist.bio && (
              <p className={styles.bio}>{psychologist.bio}</p>
            )}

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              {psychologist.email && (
                <div className={styles.contactItem}>
                  <Mail size={18} />
                  <a href={`mailto:${psychologist.email}`}>
                    {psychologist.email}
                  </a>
                </div>
              )}
              
              {psychologist.phone && (
                <div className={styles.contactItem}>
                  <Phone size={18} />
                  <a href={`tel:${psychologist.phone}`}>
                    {psychologist.phone}
                  </a>
                </div>
              )}

              {psychologist.location && (
                <div className={styles.contactItem}>
                  <MapPin size={18} />
                  <span>{psychologist.location}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>5+</div>
                <div className={styles.statLabel}>Años de experiencia</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>150+</div>
                <div className={styles.statLabel}>Clientes satisfechos</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>4.9</div>
                <div className={styles.statLabel}>Calificación</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Reservación */}
        <div className={styles.rightColumn}>
          <div className={styles.bookingCard}>
            <h2>
              <Calendar size={24} />
              Reservar una cita
            </h2>

            {success ? (
              <div className={styles.successContainer}>
                <CheckCircle size={48} className={styles.successIcon} />
                <h3>¡Cita reservada con éxito!</h3>
                <p>Serás redirigido a tus citas en unos momentos...</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); bookAppointment(); }}>
                {/* Error Alert */}
                {error && (
                  <div className={styles.errorAlert}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Date Input */}
                <div className={styles.formGroup}>
                  <label htmlFor="date" className={styles.label}>
                    Selecciona una fecha
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setAvailable([]);
                      setSelectedTime("");
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className={styles.input}
                  />
                </div>

                {/* Check Availability Button */}
                {date && available.length === 0 && (
                  <button
                    type="button"
                    onClick={checkAvailability}
                    disabled={checkingAvailability}
                    className={styles.checkBtn}
                  >
                    {checkingAvailability ? (
                      <>
                        <Loader className={styles.spinner} size={18} />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Clock size={18} />
                        Ver horarios disponibles
                      </>
                    )}
                  </button>
                )}

                {/* Available Times */}
                {available.length > 0 && (
                  <div className={styles.timesSection}>
                    <label className={styles.label}>Horarios disponibles</label>
                    <div className={styles.timesGrid}>
                      {available.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`${styles.timeBtn} ${
                            selectedTime === time ? styles.selected : ""
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  type="submit"
                  disabled={booking || !selectedTime}
                  className={styles.bookBtn}
                >
                  {booking ? (
                    <>
                      <Loader className={styles.spinner} size={20} />
                      Reservando...
                    </>
                  ) : (
                    "Confirmar reserva"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info Box */}
          <div className={styles.infoBox}>
            <h4>Información importante</h4>
            <ul>
              <li>✓ Consultas de 50 minutos</li>
              <li>✓ Primera consulta con descuento</li>
              <li>✓ Garantía de confidencialidad</li>
              <li>✓ Cancelación hasta 24 horas antes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
