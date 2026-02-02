import { useState } from "react";

export default function CardForm({ onAdd }) {
  const [texto, setTexto] = useState("");
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");

  // ✅ REGEXP: 3–80 chars, não permite só espaços
  // permite letras (inclui acentos), números e alguns símbolos comuns
  const lembreteRegex = /^(?=.{3,80}$)(?!\s*$)[\p{L}\p{N}\s.,!?()\-:;'"@#%&/]+$/u;

  function salvar(e) {
    e.preventDefault();
    setErro("");

    const t = texto.trim();

    if (!data) {
      setErro("Escolha uma data.");
      return;
    }

    if (!lembreteRegex.test(t)) {
      setErro("O lembrete deve ter 3 a 80 caracteres e não pode ter só espaços.");
      return;
    }

    onAdd({ texto: t, data });

    setTexto("");
    setData("");
  }

  return (
    <form className="card-form" onSubmit={salvar}>
      <input
        type="text"
        placeholder="Digite um lembrete..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <button type="submit">Adicionar</button>

      {erro && <div className="form-error">{erro}</div>}
    </form>
  );
}