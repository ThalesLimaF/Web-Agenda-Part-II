import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CardForm from "./components/CardForm";
import CardList from "./components/CardList";
import CalendarView from "./components/CalendarView";
import Login from "./components/Login";
import { supabase } from "./services/supabase";

export default function App() {
  const [cards, setCards] = useState([]);
  const [modoCalendario, setModoCalendario] = useState(false);

  // tema fixo (dark)
  const tema = "dark";

  const [session, setSession] = useState(null);

  useEffect(() => {
    // pega sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // escuta mudanças (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  function adicionarCard(card) {
    setCards((prev) => [...prev, { ...card, id: Date.now() }]);
  }

  function concluirCard(id) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function editarData(id, novaData) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, data: novaData } : c))
    );
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const atrasados = cards.filter((card) => {
    const dataISO = card.data.includes("-")
      ? card.data
      : card.data.split("/").reverse().join("-");
    const d = new Date(dataISO);
    d.setHours(0, 0, 0, 0);
    return d < hoje;
  }).length;

  const emDia = cards.length - atrasados;

  // ✅ se não estiver logado, mostra Login real
  if (!session) {
    return (
      <div className={`app ${tema}`}>
        <Navbar />
        <Login />
      </div>
    );
  }

  return (
    <div className={`app ${tema}`}>
      <Navbar />

      <div className="container">
        {/* 👤 barra do usuário + sair */}
        <div className="userbar">
          <span className="userchip">✅ {session.user.email}</span>
          <button
            className="logout-btn"
            type="button"
            onClick={() => supabase.auth.signOut()}
          >
            Sair
          </button>
        </div>

        <div className="summary">
          <span className="bad">🔴 {atrasados} atrasados</span>
          <span className="good">🟢 {emDia} em dia</span>
        </div>

        <div className="view-toggle">
          <button
            className={!modoCalendario ? "active" : ""}
            onClick={() => setModoCalendario(false)}
            type="button"
          >
            📋 Lista
          </button>
          <button
            className={modoCalendario ? "active" : ""}
            onClick={() => setModoCalendario(true)}
            type="button"
          >
            📅 Calendário
          </button>
        </div>

        <CardForm onAdd={adicionarCard} />

        {modoCalendario ? (
          <CalendarView
            cards={cards}
            onEditarData={editarData}
            onConcluir={concluirCard}
          />
        ) : (
          <CardList
            cards={cards}
            onConcluir={concluirCard}
            onEditarData={editarData}
          />
        )}
      </div>
    </div>
  );
}