import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [modo, setModo] = useState("login"); // "login" | "signup" | "reset"
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  function validarEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMsg("");

    if (!validarEmail(email)) return setErro("Digite um e-mail válido.");
    if (modo !== "reset" && senha.length < 6)
      return setErro("A senha deve ter pelo menos 6 caracteres.");

    setLoading(true);

    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;
        setMsg("Login realizado!");
      }

      if (modo === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        });
        if (error) throw error;

        setMsg("Conta criada! Verifique seu e-mail para confirmar (se estiver ativado).");
      }

      if (modo === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;

        setMsg("Enviamos um link de recuperação para seu e-mail.");
      }
    } catch (err) {
      setErro(err?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-head">
          <div className="login-logo">📒</div>

          <h1>
            {modo === "login" && "Entrar"}
            {modo === "signup" && "Criar conta"}
            {modo === "reset" && "Recuperar senha"}
          </h1>

          <p>
            {modo === "login" && "Acesse sua Web Agenda"}
            {modo === "signup" && "Crie seu acesso com e-mail e senha"}
            {modo === "reset" && "Vamos te enviar um link no e-mail"}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          {modo !== "reset" && (
            <label>
              Senha
              <div className="password-row">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete={modo === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label="Mostrar/ocultar senha"
                >
                  {mostrarSenha ? "🙈" : "👁️"}
                </button>
              </div>
            </label>
          )}

          {erro && <div className="login-error">{erro}</div>}
          {msg && <div className="login-ok">{msg}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Aguarde..." : modo === "login" ? "Entrar" : modo === "signup" ? "Criar conta" : "Enviar link"}
          </button>

          <div className="login-actions">
            {modo !== "login" && (
              <button type="button" className="link-btn" onClick={() => setModo("login")}>
                Já tenho conta
              </button>
            )}

            {modo !== "signup" && (
              <button type="button" className="link-btn" onClick={() => setModo("signup")}>
                Criar conta
              </button>
            )}

            {modo !== "reset" && (
              <button type="button" className="link-btn" onClick={() => setModo("reset")}>
                Esqueci minha senha
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}