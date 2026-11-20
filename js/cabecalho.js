document.addEventListener("DOMContentLoaded", function () {
  const cabecalho = document.querySelector(".cabecalho");
  if (!cabecalho) return;

  // o cabeçalho é fixo, então empurra o conteúdo para baixo
  document.body.style.paddingTop = cabecalho.offsetHeight + "px";

  // depois de rolar 60px o cabeçalho muda de estilo
  const LIMITE_ROLAGEM = 60;

  function verificarRolagem() {
    if (window.scrollY > LIMITE_ROLAGEM) {
      cabecalho.classList.add("rolado");
    } else {
      cabecalho.classList.remove("rolado");
    }
  }

  window.addEventListener("scroll", verificarRolagem);
  verificarRolagem();
});
