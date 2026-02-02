export function validarTitulo(titulo) {
  const regex = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ0-9\s]{3,50}$/;
  return regex.test(titulo);
}

export function validarDescricao(descricao) {
  const regex = /^[A-Za-zÀ-ÿ0-9\s.,!?()-]{5,200}$/;
  return regex.test(descricao);
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}