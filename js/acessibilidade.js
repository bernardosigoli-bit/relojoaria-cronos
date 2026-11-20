(function () {
  const CHAVE = "relojoaria_acessibilidade";
  const html = document.documentElement;

  // tamanhos da fonte em %: cada clique em A+ ou A- anda uma posição
  const TAMANHOS = [100, 112, 125, 150];

  // preferências de acessibilidade, guardadas no localStorage
  let prefs = { tamanho: 0, contraste: false, links: false, semAnimacao: false };
  try {
    prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(CHAVE)) || {});
  } catch (e) {  }

  // aplica as preferências no <html> (o CSS usa esses atributos)
  function aplicar() {
    html.style.fontSize = TAMANHOS[prefs.tamanho] + "%";
    html.toggleAttribute("data-contraste", prefs.contraste);
    html.toggleAttribute("data-links", prefs.links);
    html.toggleAttribute("data-sem-animacao", prefs.semAnimacao);
    if (prefs.contraste) html.setAttribute("data-contraste", "alto");
    localStorage.setItem(CHAVE, JSON.stringify(prefs));

    const cabecalho = document.querySelector(".cabecalho");
    if (cabecalho) document.body.style.paddingTop = cabecalho.offsetHeight + "px";
  }
  aplicar();

  document.addEventListener("DOMContentLoaded", function () {
    aplicar();

    // monta o botão Aa e o painel de acessibilidade
    const caixa = document.createElement("div");
    caixa.className = "a11y";
    caixa.innerHTML = `
      <button type="button" class="a11y-abrir" aria-expanded="false" aria-controls="a11y-painel"
              aria-label="Opções de acessibilidade" title="Acessibilidade">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="7.2" r="1.3" fill="currentColor" stroke="none"/>
          <path d="M6.8 9.6c3.4 1 6.6 1 10.4 0"/>
          <path d="M12 10v3.4"/>
          <path d="M12 13.4l-2.4 4.6M12 13.4l2.4 4.6"/>
        </svg>
      </button>
      <div class="a11y-painel" id="a11y-painel" role="group" aria-label="Opções de acessibilidade" hidden>
        <div class="a11y-linha">
          <span>Tamanho do texto</span>
          <span>
            <button type="button" data-acao="menos" aria-label="Diminuir texto">A−</button>
            <button type="button" data-acao="mais" aria-label="Aumentar texto">A+</button>
          </span>
        </div>
        <button type="button" data-acao="contraste" aria-pressed="false">Alto contraste</button>
        <button type="button" data-acao="links" aria-pressed="false">Sublinhar links</button>
        <button type="button" data-acao="animacao" aria-pressed="false">Reduzir animações</button>
        <button type="button" data-acao="limpar">Restaurar padrão</button>
      </div>`;
    document.body.appendChild(caixa);

    const abrir = caixa.querySelector(".a11y-abrir");
    const painel = caixa.querySelector(".a11y-painel");

    function pintar() {
      caixa.querySelector('[data-acao="contraste"]').setAttribute("aria-pressed", prefs.contraste);
      caixa.querySelector('[data-acao="links"]').setAttribute("aria-pressed", prefs.links);
      caixa.querySelector('[data-acao="animacao"]').setAttribute("aria-pressed", prefs.semAnimacao);
    }
    pintar();

    function alternarPainel(mostrar) {
      painel.hidden = !mostrar;
      abrir.setAttribute("aria-expanded", mostrar);
    }
    abrir.addEventListener("click", () => alternarPainel(painel.hidden));
    caixa.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !painel.hidden) { alternarPainel(false); abrir.focus(); }
    });

    painel.addEventListener("click", (e) => {
      const acao = e.target.dataset.acao;
      if (!acao) return;
      if (acao === "mais") prefs.tamanho = Math.min(prefs.tamanho + 1, TAMANHOS.length - 1);
      if (acao === "menos") prefs.tamanho = Math.max(prefs.tamanho - 1, 0);
      if (acao === "contraste") prefs.contraste = !prefs.contraste;
      if (acao === "links") prefs.links = !prefs.links;
      if (acao === "animacao") prefs.semAnimacao = !prefs.semAnimacao;
      if (acao === "limpar") prefs = { tamanho: 0, contraste: false, links: false, semAnimacao: false };
      aplicar();
      pintar();
    });

    const vw = document.createElement("div");
    vw.setAttribute("vw", "");
    vw.className = "enabled";
    vw.innerHTML =
      '<div vw-access-button class="active"></div>' +
      '<div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
    document.body.appendChild(vw);

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.onload = function () {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    };
    document.body.appendChild(script);
  });
})();
