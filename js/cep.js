// se a busca falhar, libera os campos para a pessoa digitar o endereço
function liberarEndereco() {
  ["endereco", "bairro", "cidade", "uf"].forEach((id) => {
    document.getElementById(id).readOnly = false;
  });
}

// consulta a API ViaCEP e preenche rua, bairro, cidade e UF
async function buscarEnderecoPorCep() {
  const campoCep = document.getElementById("cep");
  const mensagem = document.getElementById("cep-mensagem");
  const botao = document.getElementById("botao-buscar-cep");

  const cep = campoCep.value.replace(/\D/g, "");

  mensagem.textContent = "";
  mensagem.className = "mensagem-erro";

  if (cep.length !== 8) {
    mensagem.textContent = "Digite um CEP válido com 8 números.";
    return;
  }

  try {
    botao.disabled = true;
    botao.textContent = "Buscando...";

    // chamada na API do ViaCEP
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    // o ViaCEP devolve erro: true quando o CEP não existe
    if (dados.erro) {
      liberarEndereco();
      mensagem.textContent = "CEP não encontrado. Confira o número digitado ou preencha manualmente.";
      return;
    }

    document.getElementById("endereco").value = dados.logradouro || "";
    document.getElementById("bairro").value = dados.bairro || "";
    document.getElementById("cidade").value = dados.localidade || "";
    document.getElementById("uf").value = dados.uf || "";
    document.getElementById("uf").dispatchEvent(new Event("input"));

    ["endereco", "bairro", "cidade", "uf"].forEach((id) => {
      if (typeof mostrarErroCampo === "function") mostrarErroCampo(document.getElementById(id), "");
    });

    document.getElementById("numero").focus();

    mensagem.className = "mensagem-sucesso";
    mensagem.textContent = "Endereço encontrado! Confira os dados abaixo.";
  } catch (erro) {
    liberarEndereco();
    mensagem.textContent = "Não foi possível buscar o CEP agora. Preencha o endereço manualmente.";
    console.error("Erro ao buscar CEP:", erro);
  } finally {
    botao.disabled = false;
    botao.textContent = "Buscar CEP";
  }
}

// busca sozinha quando o CEP chega a 8 números
document.addEventListener("DOMContentLoaded", function () {
  const campoCep = document.getElementById("cep");
  if (!campoCep) return;

  campoCep.addEventListener("input", function () {
    mascararCEP(campoCep);
    if (somenteDigitos(campoCep.value).length === 8) buscarEnderecoPorCep();
  });
});
