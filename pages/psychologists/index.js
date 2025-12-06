import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function PsychologistsPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/psychologists").then((res) => {
      setList(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Psicólogos Disponibles</h1>

      <Link href="/">← Volver al inicio</Link>

      <ul>
        {list.map((p) => (
          <li key={p.id}>
            <strong>{p.fullName}</strong> – {p.specialty}
            <br />
            <Link href={`/psychologists/${p.id}`}>Ver horarios</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
