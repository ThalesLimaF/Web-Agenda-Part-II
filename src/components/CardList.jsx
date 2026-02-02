export default function CardList({ cards, onConcluir, onEditarData }) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  function toISO(data) {
    // aceita "YYYY-MM-DD" ou "DD/MM/YYYY"
    if (!data) return "";
    if (data.includes("-")) return data; // já ISO
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }

  function parseData(data) {
    const iso = toISO(data);
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function estaAtrasado(data) {
    return parseData(data) < hoje.getTime();
  }

  // Ordena: atrasados primeiro, depois por data
  const cardsOrdenados = [...cards].sort((a, b) => {
    const atrasoA = estaAtrasado(a.data);
    const atrasoB = estaAtrasado(b.data);

    if (atrasoA !== atrasoB) return atrasoA ? -1 : 1;
    return parseData(a.data) - parseData(b.data);
  });

  // Agrupar por data (chave normalizada em ISO pra não duplicar)
  const grupos = {};
  cardsOrdenados.forEach((card) => {
    const chave = toISO(card.data);
    if (!grupos[chave]) grupos[chave] = [];
    grupos[chave].push(card);
  });

  const datasOrdenadas = Object.keys(grupos).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className="agenda">
      {datasOrdenadas.map((dataISO) => (
        <div key={dataISO} className="agenda-day">
          <h3>{new Date(dataISO).toLocaleDateString("pt-BR")}</h3>

          {grupos[dataISO].map((card) => {
            const atrasado = estaAtrasado(card.data);

            return (
              <div key={card.id} className={`card ${atrasado ? "atrasado" : ""}`}>
                <div className="card-header">
                  <span className={`badge ${atrasado ? "bad" : "good"}`}>
                    {atrasado ? "🔴 Atrasado" : "🟢 Em dia"}
                  </span>

                  <label className="check">
                    <input type="checkbox" onChange={() => onConcluir(card.id)} />
                    <span></span>
                  </label>
                </div>

                <p>{card.texto}</p>

                <input
                  type="date"
                  value={toISO(card.data)}
                  onChange={(e) => onEditarData(card.id, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}