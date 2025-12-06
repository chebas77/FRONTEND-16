import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { Plus, Trash2, Edit, Loader, AlertCircle, ArrowLeft } from "lucide-react";
import styles from "../../styles/AdminPsychologists.module.css";

export default function AdminPsychologistsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    specialty: "",
    description: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchPsychologists();
    }
  }, [user]);

  const fetchPsychologists = async () => {
    setLoading(true);
    try {
      const res = await api.get("/psychologists");
      setPsychologists(res.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar psicólogos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/psychologists/${editing.id}`, formData);
        setPsychologists(prev =>
          prev.map(p => p.id === editing.id ? { ...p, ...formData } : p)
        );
      } else {
        const res = await api.post("/psychologists", formData);
        setPsychologists(prev => [...prev, res.data.psy]);
      }
      resetForm();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    }
  };

  const handleEdit = (psy) => {
    setEditing(psy);
    setFormData({
      fullName: psy.fullName,
      specialty: psy.specialty,
      description: psy.description || "",
      email: psy.email,
      phone: psy.phone || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro?")) return;
    try {
      await api.delete(`/psychologists/${id}`);
      setPsychologists(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError("Error al eliminar");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({
      fullName: "",
      specialty: "",
      description: "",
      email: "",
      phone: "",
    });
  };

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
        <h1>Administrar Psicólogos</h1>
        <button onClick={() => setShowForm(true)} className={styles.newBtn}>
          <Plus size={20} />
          Nuevo
        </button>
      </div>

      {error && (
        <div className={styles.alert}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <Loader className={styles.spinner} size={40} />
          <p>Cargando...</p>
        </div>
      ) : psychologists.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay psicólogos</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {psychologists.map(psy => (
                <tr key={psy.id}>
                  <td>{psy.fullName}</td>
                  <td>{psy.specialty}</td>
                  <td>{psy.email}</td>
                  <td>{psy.phone || "-"}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(psy)} className={styles.editBtn}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(psy.id)} className={styles.deleteBtn}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className={styles.modalOverlay} onClick={resetForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Editar" : "Nuevo Psicólogo"}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nombre *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Especialidad *</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={!!editing}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  {editing ? "Guardar" : "Crear"}
                </button>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}