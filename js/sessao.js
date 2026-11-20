// nomes das chaves usadas no localStorage e no sessionStorage
const CHAVE_USUARIO = "relojoaria_usuario";
const CHAVE_SESSAO = "relojoaria_logado";

// categorias do submenu do cabeçalho e do filtro do catálogo
const CATEGORIAS = [
  { chave: "social", nome: "Social" },
  { chave: "esportivo", nome: "Esportivo" },
  { chave: "estilo", nome: "Vintage e Estilo" },
];

// lê o cadastro salvo no localStorage (devolve null se não tiver)
function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO));
  } catch (erro) {
    return null;
  }
}

// guarda o cadastro como objeto JSON no localStorage
function salvarUsuario(usuario) {
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

// o login fica no sessionStorage: fechou a aba, saiu da conta
function estaLogado() {
  return sessionStorage.getItem(CHAVE_SESSAO) === "true" && obterUsuario() !== null;
}

// chamada depois que o login confere
function iniciarSessao() {
  sessionStorage.setItem(CHAVE_SESSAO, "true");
}

// logout: apaga a sessão e volta para a página inicial
function sair() {
  sessionStorage.removeItem(CHAVE_SESSAO);
  window.location.href = "index.html";
}

// protege as páginas restritas: sem login, manda para a página de erro (ou para o login, no caso do checkout)
function exigirLogin(motivo) {
  if (estaLogado()) return;
  window.location.replace(motivo ? "login.html?motivo=" + motivo : "404.html?erro=auth");
}

// evita que o nome digitado seja lido como HTML
function escaparHtml(texto) {
  const apoio = document.createElement("div");
  apoio.textContent = texto;
  return apoio.innerHTML;
}

function linksCategorias(prefixo) {
  return CATEGORIAS.map(
    (c) => `<a href="index.html?categoria=${c.chave}#catalogo">${prefixo}${c.nome}</a>`
  ).join("");
}

// monta o menu do topo: submenu de categorias + Entrar/Cadastrar ou 'Olá, nome' com o botão Sair
function montarCabecalho() {
  const nav = document.getElementById("navegacao");
  if (!nav) return;

  const itensCategorias = CATEGORIAS.map(
    (c) => `<li><a href="index.html?categoria=${c.chave}#catalogo">${c.nome}</a></li>`
  ).join("");

  let conta = `<a href="login.html" class="nav-entrar">Entrar / Cadastrar</a>`;
  if (estaLogado()) {
    const nome = escaparHtml(obterUsuario().nome);
    conta = `<a href="perfil.html" class="nav-usuario" title="${nome}">Olá, ${nome}</a>
             <button type="button" class="nav-sair" id="botao-sair">Sair</button>`;
  }

  nav.innerHTML = `
    <div class="nav-categorias">
      <button type="button" class="nav-categorias-botao" id="botao-categorias"
              aria-expanded="false" aria-haspopup="true" aria-controls="submenu-categorias">
        Categorias <span aria-hidden="true">▾</span>
      </button>
      <ul class="submenu" id="submenu-categorias" hidden>
        <li><a href="index.html#catalogo">Todos os relógios</a></li>
        ${itensCategorias}
      </ul>
    </div>
    ${conta}`;

  const botaoCategorias = document.getElementById("botao-categorias");
  const submenu = document.getElementById("submenu-categorias");

  function alternarSubmenu(mostrar) {
    submenu.hidden = !mostrar;
    botaoCategorias.setAttribute("aria-expanded", mostrar);
  }

  botaoCategorias.addEventListener("click", (e) => {
    e.stopPropagation();
    alternarSubmenu(submenu.hidden);
  });
  document.addEventListener("click", () => alternarSubmenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") alternarSubmenu(false);
  });

  const botaoSair = document.getElementById("botao-sair");
  if (botaoSair) botaoSair.addEventListener("click", sair);
}

// monta o menu lateral (celular) com os links de visitante ou de quem está logado
function montarMenuLateral() {
  const nav = document.getElementById("menu-nav");
  if (!nav) return;

  const contaLogada = `
    <a href="perfil.html">Meu perfil</a>
    <a href="feedback.html">Enviar feedback</a>
    <a href="dados.html">Meus dados enviados</a>
    <a href="#" id="menu-sair">Sair (Logout)</a>`;
  const contaVisitante = `
    <a href="login.html">Entrar / Cadastrar</a>`;

  nav.innerHTML = `
    <a href="index.html">Início</a>
    <a href="index.html#catalogo">Catálogo</a>
    <div class="menu-submenu">
      <span class="menu-submenu-titulo">Categorias</span>
      ${linksCategorias("")}
    </div>
    <a href="index.html?favoritos=1#catalogo">Favoritos ♥</a>
    <a href="pedidos.html">Meus pedidos</a>
    <a href="sobre.html">Sobre nós</a>
    <a href="contato.html">Contato</a>
    <a href="checkout.html">Carrinho <span class="carrinho-contador js-contador-carrinho">0</span></a>
    ${estaLogado() ? contaLogada : contaVisitante}`;

  const menuSair = document.getElementById("menu-sair");
  if (menuSair) {
    menuSair.addEventListener("click", (e) => {
      e.preventDefault();
      sair();
    });
  }
}

// quando a página carrega, monta os dois menus
document.addEventListener("DOMContentLoaded", function () {
  montarCabecalho();
  montarMenuLateral();
  if (typeof atualizarContadorCarrinho === "function") atualizarContadorCarrinho();
});
