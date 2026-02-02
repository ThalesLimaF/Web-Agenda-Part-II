<div className={`card ${atrasado ? "atrasado" : ""}`}>
  <div className="card-content">
    <h3>{card.texto}</h3>

    <div className="card-date">
      📅
      <input
        type="date"
        value={card.data}
        onChange={(e) => onEditarData(card.id, e.target.value)}
      />
    </div>
  </div>

  <div className="card-actions">
    <button onClick={() => onConcluir(card.id)}>
      Concluir
    </button>
  </div>
</div>