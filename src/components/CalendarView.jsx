import { useMemo, useState } from "react";

export default function CalendarView({ cards, onEditarData, onConcluir }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  function toISO(data) {
    if (!data) return "";
    if (data.includes("-")) return data;
    const [d, m, y] = data.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  function isLate(card) {
    const d = new Date(toISO(card.data));
    d.setHours(0, 0, 0, 0);
    const h = new Date();
    h.setHours(0, 0, 0, 0);
    return d.getTime() < h.getTime();
  }

  const monthLabel = new Date(ano, mes, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const { cells, startWeekday, daysInMonth } = useMemo(() => {
    const start = new Date(ano, mes, 1);
    const startWeekday = start.getDay();
    const daysInMonth = new Date(ano, mes + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ type: "empty", key: `e-${i}` });
    for (let day = 1; day <= daysInMonth; day++) cells.push({ type: "day", day, key: `d-${day}` });

    return { cells, startWeekday, daysInMonth };
  }, [ano, mes]);

  function prevMonth() {
    setMes((m) => {
      if (m === 0) {
        setAno((a) => a - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function nextMonth() {
    setMes((m) => {
      if (m === 11) {
        setAno((a) => a + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function openCardModal(card) {
    setSelectedCard(card);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCard(null);
  }

  return (
    <>
      <section className="cal">
        <div className="cal-top">
          <div className="cal-nav">
            <button type="button" className="cal-btn" onClick={prevMonth}>◀</button>
            <h2 className="cal-title">{monthLabel}</h2>
            <button type="button" className="cal-btn" onClick={nextMonth}>▶</button>
          </div>

          <span className="cal-hint">Clique num card para editar</span>
        </div>

        <div className="cal-weekdays">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((w) => (
            <div key={w} className="cal-weekday">{w}</div>
          ))}
        </div>

        <div className="cal-grid">
          {cells.map((c) => {
            if (c.type === "empty") return <div key={c.key} className="cal-cell cal-empty" />;

            const dayISO = new Date(ano, mes, c.day).toISOString().slice(0, 10);
            const cardsDoDia = cards.filter((x) => toISO(x.data) === dayISO);

            const isToday =
              c.day === hoje.getDate() &&
              mes === hoje.getMonth() &&
              ano === hoje.getFullYear();

            return (
              <div key={c.key} className={`cal-cell ${isToday ? "cal-today" : ""}`}>
                <div className="cal-daynum">{c.day}</div>

                <div className="cal-items">
                  {cardsDoDia.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      className={`cal-item ${isLate(card) ? "late" : ""}`}
                      onClick={() => openCardModal(card)}
                      title="Editar"
                    >
                      {card.texto}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL */}
      {modalOpen && selectedCard && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Editar lembrete</h3>
              <button className="modal-x" onClick={closeModal} type="button">✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-row">
                <div className="modal-label">Texto</div>
                <div className="modal-text">{selectedCard.texto}</div>
              </div>

              <div className="modal-row">
                <label className="modal-label" htmlFor="data">Data</label>
                <input
                  id="data"
                  type="date"
                  value={toISO(selectedCard.data)}
                  onChange={(e) => {
                    const nova = e.target.value;
                    onEditarData(selectedCard.id, nova);
                    setSelectedCard((c) => ({ ...c, data: nova }));
                  }}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-danger"
                type="button"
                onClick={() => {
                  onConcluir(selectedCard.id);
                  closeModal();
                }}
              >
                Concluir
              </button>

              <button className="btn-ghost" type="button" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}