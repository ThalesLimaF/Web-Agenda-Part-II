export function diasParaData(data) {
  const hoje = new Date();
  const alvo = new Date(data);
  const diff = alvo - hoje;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function corPorProximidade(data) {
  const dias = diasParaData(data);
  if (dias < 0) return 'atrasado';
  if (dias <= 2) return 'vermelho';
  if (dias <= 5) return 'amarelo';
  return 'verde';
}
