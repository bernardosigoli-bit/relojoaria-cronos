document.addEventListener("DOMContentLoaded", function () {
  const botaoAbrir = document.getElementById("botao-menu");
  const botaoFechar = document.getElementById("botao-fechar-menu");
  const menuLateral = document.getElementById("menu-lateral");
  const overlay = document.getElementById("overlay-menu");

  if (!botaoAbrir || !menuLateral || !overlay) return;

  // menu lateral: a classe 'aberto' faz ele deslizar para dentro da tela
  function abrirMenu() {
    menuLateral.classList.add("aberto");
    overlay.classList.add("visivel");
  }

  function fecharMenu() {
    menuLateral.classList.remove("aberto");
    overlay.classList.remove("visivel");
  }

  botaoAbrir.addEventListener("click", abrirMenu);
  botaoFechar?.addEventListener("click", fecharMenu);
  overlay.addEventListener("click", fecharMenu);

  // tecla ESC fecha o menu
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") fecharMenu();
  });
});
