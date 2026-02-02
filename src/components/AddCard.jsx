import { regexTitulo, regexDescricao, regexData } from "../utils/validacoes";
import { useState } from "react";

function AddCard() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!regexTitulo.test(titulo)) {
      alert("Título inválido (mín. 3 letras)");
      return;
    }

    if (!regexDescricao.test(descricao)) {
      alert("Descrição inválida");
      return;
    }

    if (!regexData.test(data)) {
      alert("Data inválida");
      return;
    }

    // ✅ Dados válidos → pode salvar no Supabase
    console.log("Lembrete válido");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
      />

      <input
        type="date"
        value={data}
        onChange={e => setData(e.target.value)}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}

export default AddCard;