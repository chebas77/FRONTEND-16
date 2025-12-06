import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { Loader, AlertCircle, ArrowLeft, Eye } from "lucide-react";
import styles from "../../styles/AdminAppointments.module.css";

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments/admin/all");
      setAppointments(res.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "CANCELLED":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  }

  const filteredAppointments = filter === "all"
    ? appointments
    : appointments.filter(a => a.status === filter);

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push("/")} className={styles.backBtn}>
          <ArrowLeft size={20} />
          Volver
        </button>
        <h1>Todas las Citas Reservadas</h1>
        <div style={{ width: "120px" }}></div>
      </div>

      {error && (
        <div className={styles.alert}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.filterSection}>
        <label>Filtrar por estado:</label>
        <div className={styles.filterButtons}>
          {["all", "CONFIRMED", "PENDING", "CANCELLED"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`${styles.filterBtn} ${filter === s ? styles.active : ""}`}
            >
              {s === "all" ? "Todas" : getStatusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Loader className={styles.spinner} size={40} />
          <p>Cargando citas...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay citas en este filtro</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Email</th>
                <th>Psicólogo</th>
                <th>Especialidad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(apt => (
                <tr key={apt.id}>
                  <td>
                    <strong>{apt.patient?.fullName || "N/A"}</strong>
                  </td>
                  <td>{apt.patient?.email || "N/A"}</td>
                  <td>{apt.Psychologist?.fullName || "N/A"}</td>
                  <td>{apt.Psychologist?.specialty || "N/A"}</td>
                  <td>{new Date(apt.date).toLocaleDateString("es-ES")}</td>
                  <td>{apt.time}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{ backgroundColor: `${getStatusColor(apt.status)}20`, color: getStatusColor(apt.status) }}
                    >
                      {getStatusLabel(apt.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total de citas</div>
          <div className={styles.summaryValue}>{appointments.length}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Confirmadas</div>
          <div className={styles.summaryValue} style={{ color: "#10B981" }}>
            {appointments.filter(a => a.status === "CONFIRMED").length}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Pendientes</div>
          <div className={styles.summaryValue} style={{ color: "#F59E0B" }}>
            {appointments.filter(a => a.status === "PENDING").length}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Canceladas</div>
          <div className={styles.summaryValue} style={{ color: "#EF4444" }}>
            {appointments.filter(a => a.status === "CANCELLED").length}
          </div>
        </div>
      </div>
    </div>
  );
}