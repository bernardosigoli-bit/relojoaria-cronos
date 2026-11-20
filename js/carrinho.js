// carrinho, pedidos, favoritos, avaliações e cupons: tudo fica salvo no localStorage
const CHAVE_CARRINHO = "relojoaria_carrinho";

function obterCarrinho() {
  const dados = localStorage.getItem(CHAVE_CARRINHO);
  return dados ? JSON.parse(dados) : [];
}

function salvarCarrinho(itens) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
}

// se o relógio já está no carrinho soma 1 na quantidade; senão adiciona
function adicionarAoCarrinho(produto) {
  const itens = obterCarrinho();
  const existente = itens.find((item) => item.id === produto.id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    itens.push({ ...produto, quantidade: 1 });
  }

  salvarCarrinho(itens);
  atualizarContadorCarrinho();
}

function removerDoCarrinho(id) {
  const itens = obterCarrinho().filter((item) => item.id !== id);
  salvarCarrinho(itens);
}

function calcularTotalCarrinho() {
  return obterCarrinho().reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
}

function contarItensCarrinho() {
  return obterCarrinho().reduce((total, item) => total + item.quantidade, 0);
}

function atualizarContadorCarrinho() {
  const contadores = document.querySelectorAll(".js-contador-carrinho");
  contadores.forEach((contador) => {
    contador.textContent = contarItensCarrinho();
  });
}

// formata o número como dinheiro (R$ 1.234,56)
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

document.addEventListener("DOMContentLoaded", atualizarContadorCarrinho);

// botões + e - do carrinho; item com quantidade 0 sai da lista
function alterarQuantidade(id, delta) {
  const itens = obterCarrinho();
  const item = itens.find((i) => i.id === id);
  if (!item) return;
  item.quantidade += delta;
  salvarCarrinho(itens.filter((i) => i.quantidade > 0));
  atualizarContadorCarrinho();
}

// frete fixo por região (agrupei os estados)
const FRETE_POR_REGIAO = {
  sudeste: { ufs: ["SP", "RJ", "MG", "ES"], valor: 19.9 },
  sulCentro: { ufs: ["PR", "SC", "RS", "GO", "DF", "MT", "MS"], valor: 29.9 },
  nordeste: { ufs: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"], valor: 39.9 },
  norte: { ufs: ["AM", "PA", "AC", "RO", "RR", "AP", "TO"], valor: 49.9 },
};
const FRETE_GRATIS_ACIMA = 1500;

// devolve o frete pela UF; é grátis acima de R$ 1500
function calcularFrete(uf, subtotal) {
  uf = (uf || "").trim().toUpperCase();
  for (const regiao of Object.values(FRETE_POR_REGIAO)) {
    if (regiao.ufs.includes(uf)) {
      return subtotal >= FRETE_GRATIS_ACIMA ? 0 : regiao.valor;
    }
  }
  return null;
}

const CHAVE_PEDIDOS = "relojoaria_pedidos";

function obterPedidos() {
  const dados = localStorage.getItem(CHAVE_PEDIDOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarPedido(pedido) {
  const pedidos = obterPedidos();
  pedidos.unshift(pedido);
  localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify(pedidos));
}

const CHAVE_FAVORITOS = "relojoaria_favoritos";

function obterFavoritos() {
  const dados = localStorage.getItem(CHAVE_FAVORITOS);
  return dados ? JSON.parse(dados) : [];
}

function ehFavorito(id) {
  return obterFavoritos().includes(id);
}

function alternarFavorito(id) {
  let favoritos = obterFavoritos();
  const ja = favoritos.includes(id);
  favoritos = ja ? favoritos.filter((f) => f !== id) : [...favoritos, id];
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
  return !ja;
}

// aviso rápido que aparece no canto e some sozinho (usado no lugar do alert)
function mostrarToast(mensagem) {
  let area = document.getElementById("area-toast");
  if (!area) {
    area = document.createElement("div");
    area.id = "area-toast";
    area.setAttribute("role", "status");
    area.setAttribute("aria-live", "polite");
    document.body.appendChild(area);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensagem;
  area.appendChild(toast);

  setTimeout(() => toast.classList.add("visivel"), 10);
  setTimeout(() => {
    toast.classList.remove("visivel");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

const CHAVE_AVALIACOES = "relojoaria_avaliacoes";

function obterAvaliacoes(idProduto) {
  const dados = localStorage.getItem(CHAVE_AVALIACOES);
  const todas = dados ? JSON.parse(dados) : {};
  return todas[idProduto] || [];
}

function salvarAvaliacao(idProduto, nota, comentario) {
  const dados = localStorage.getItem(CHAVE_AVALIACOES);
  const todas = dados ? JSON.parse(dados) : {};
  if (!todas[idProduto]) todas[idProduto] = [];
  todas[idProduto].unshift({ nota: nota, comentario: comentario, data: new Date().toISOString() });
  localStorage.setItem(CHAVE_AVALIACOES, JSON.stringify(todas));
}

function removerAvaliacao(idProduto, indice) {
  const dados = localStorage.getItem(CHAVE_AVALIACOES);
  const todas = dados ? JSON.parse(dados) : {};
  if (!todas[idProduto]) return;
  todas[idProduto].splice(indice, 1);
  if (todas[idProduto].length === 0) delete todas[idProduto];
  localStorage.setItem(CHAVE_AVALIACOES, JSON.stringify(todas));
}

function mediaAvaliacoes(idProduto) {
  const lista = obterAvaliacoes(idProduto);
  if (lista.length === 0) return 0;
  return lista.reduce((soma, a) => soma + a.nota, 0) / lista.length;
}

function textoEstrelas(nota) {
  const cheias = Math.round(nota);
  return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

// cupons de desconto para teste
const CUPONS = {
  BEMVINDO10: {
    tipo: "percentual",
    valor: 10,
    primeiraCompra: true,
    descricao: "10% de desconto na primeira compra",
    destaque: "10% OFF",
    legenda: "Primeira compra",
  },
  CRONOS50: {
    tipo: "fixo",
    valor: 50,
    primeiraCompra: false,
    descricao: "R$ 50 de desconto no pedido",
    destaque: "R$ 50 OFF",
    legenda: "Em qualquer pedido",
  },
};

function emailAtual() {
  const usuario = typeof obterUsuario === "function" ? obterUsuario() : null;
  return usuario ? usuario.login.toLowerCase() : "";
}

function ehPrimeiraCompra(email = emailAtual()) {
  return !obterPedidos().some((pedido) => (pedido.email || "") === email);
}

function calcularDesconto(cupom, subtotal) {
  const bruto = cupom.tipo === "percentual" ? (subtotal * cupom.valor) / 100 : cupom.valor;
  return Math.round(Math.min(bruto, subtotal) * 100) / 100;
}

// confere se o cupom existe e se pode ser usado (alguns valem só na primeira compra)
function validarCupom(codigoDigitado, subtotal) {
  const codigo = (codigoDigitado || "").trim().toUpperCase();
  if (codigo === "") return { valido: false, mensagem: "Digite o código do cupom." };

  const cupom = CUPONS[codigo];
  if (!cupom) return { valido: false, mensagem: "Cupom inválido. Confira o código digitado." };

  if (cupom.primeiraCompra && !ehPrimeiraCompra()) {
    return { valido: false, mensagem: "Este cupom é válido apenas na primeira compra." };
  }
  if (subtotal <= 0) {
    return { valido: false, mensagem: "Adicione itens ao carrinho para usar um cupom." };
  }

  return {
    valido: true,
    codigo,
    desconto: calcularDesconto(cupom, subtotal),
    mensagem: `Cupom ${codigo} aplicado: ${cupom.descricao}.`,
  };
}

async function copiarCupom(chip) {
  const codigo = chip.dataset.codigo;
  const dica = document.getElementById("dica-cupom");
  try {
    await navigator.clipboard.writeText(codigo);
    dica.textContent = `Código ${codigo} copiado! Cole no campo de cupom da finalização da compra.`;
  } catch {
    dica.textContent = `Use o código ${codigo} no campo de cupom da finalização da compra.`;
  }
  chip.classList.add("copiado");
  setTimeout(() => chip.classList.remove("copiado"), 1500);
}

function renderizarCuponsNoCatalogo() {
  const lista = document.getElementById("lista-cupons");
  if (!lista) return;
  lista.innerHTML = Object.entries(CUPONS)
    .map(
      ([codigo, cupom]) => `
        <button type="button" class="cupom-chip" data-codigo="${codigo}">
          <b class="cupom-valor">${cupom.destaque}</b>
          <span class="cupom-info"><strong>${codigo}</strong><small>${cupom.legenda}</small></span>
        </button>`
    )
    .join("");
  lista.querySelectorAll(".cupom-chip").forEach((chip) => {
    chip.addEventListener("click", () => copiarCupom(chip));
  });
}

function renderizarNotaBoasVindas() {
  const nota = document.getElementById("nota-cupom");
  if (!nota) return;
  const entrada = Object.entries(CUPONS).find(([, cupom]) => cupom.primeiraCompra);
  if (!entrada) {
    nota.remove();
    return;
  }
  const [codigo, cupom] = entrada;
  nota.innerHTML = `Crie sua conta e use o cupom <strong>${codigo}</strong>: ${cupom.descricao}.`;
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarCuponsNoCatalogo();
  renderizarNotaBoasVindas();
});


// adiciona ao carrinho; se o item já estiver lá, abre uma janela de aviso
function adicionarComAviso(produto) {
  const jaTem = obterCarrinho().some((item) => item.id === produto.id);

  if (!jaTem) {
    adicionarAoCarrinho(produto);
    mostrarToast(produto.nome + " adicionado ao carrinho ✓");
    animarCarrinho();
    return;
  }

  abrirJanelaItemNoCarrinho(produto);
}

// faz o botão do carrinho dar um "pulinho" para chamar atenção
function animarCarrinho() {
  const botao = document.querySelector(".carrinho-flutuante");
  if (!botao) return;
  botao.classList.remove("pulando");
  void botao.offsetWidth;
  botao.classList.add("pulando");
}

function abrirJanelaItemNoCarrinho(produto) {
  const antiga = document.getElementById("janela-carrinho");
  if (antiga) antiga.remove();

  const quantidade = obterCarrinho().find((item) => item.id === produto.id).quantidade;

  const fundo = document.createElement("div");
  fundo.id = "janela-carrinho";
  fundo.className = "janela-fundo";
  fundo.innerHTML = `
    <div class="janela" role="dialog" aria-modal="true" aria-labelledby="janela-titulo">
      <div class="janela-icone" aria-hidden="true">!</div>
      <h2 id="janela-titulo">Este item já está no carrinho</h2>
      <p><strong>${produto.nome}</strong> já foi adicionado (${quantidade} ${quantidade === 1 ? "unidade" : "unidades"}). Deseja levar mais uma?</p>
      <div class="janela-botoes">
        <a href="checkout.html" class="botao">Ver carrinho</a>
        <button type="button" class="botao botao-secundario" id="janela-mais">Adicionar mais uma</button>
        <button type="button" class="janela-fechar" id="janela-fechar">Continuar comprando</button>
      </div>
    </div>
  `;
  document.body.appendChild(fundo);

  function fechar() {
    fundo.remove();
    document.removeEventListener("keydown", teclado);
  }
  function teclado(evento) {
    if (evento.key === "Escape") fechar();
  }

  document.addEventListener("keydown", teclado);
  fundo.addEventListener("click", (evento) => {
    if (evento.target === fundo) fechar();
  });
  document.getElementById("janela-fechar").addEventListener("click", fechar);
  document.getElementById("janela-mais").addEventListener("click", () => {
    adicionarAoCarrinho(produto);
    mostrarToast("Quantidade atualizada no carrinho ✓");
    animarCarrinho();
    fechar();
  });
  document.getElementById("janela-fechar").focus();
}
