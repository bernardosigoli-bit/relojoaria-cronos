// tira tudo que não for número do texto
function somenteDigitos(texto) {
  return String(texto).replace(/\D/g, "");
}

// máscara do CPF: coloca os pontos e o traço enquanto a pessoa digita (000.000.000-00)
function mascararCPF(campo) {
  let n = somenteDigitos(campo.value).slice(0, 11);
  n = n.replace(/^(\d{3})(\d)/, "$1.$2")
       .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
       .replace(/\.(\d{3})(\d)/, ".$1-$2");
  campo.value = n;
}

// máscara do telefone no formato (+55)XX-XXXXXXXX
function mascararTelefone(campo) {
  let texto = campo.value;
  if (/^[(+]/.test(texto)) texto = texto.replace(/^\(?\+?5?5?\)?/, "");
  const n = somenteDigitos(texto).slice(0, 11);
  if (n === "") {
    campo.value = "";
    return;
  }
  campo.value = "(+55)" + n.slice(0, 2) + (n.length > 2 ? "-" + n.slice(2) : "");
}

// máscara do CEP: 00000-000
function mascararCEP(campo) {
  const n = somenteDigitos(campo.value).slice(0, 8);
  campo.value = n.length > 5 ? n.slice(0, 5) + "-" + n.slice(5) : n;
}

// confere os dois dígitos verificadores do CPF (não basta ter 11 números)
function cpfValido(cpf) {
  const n = somenteDigitos(cpf);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  // faz a conta duas vezes: primeiro dígito (9 números) e segundo dígito (10 números)
  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(n[i]) * (tamanho + 1 - i);
    }
    // resto da divisão por 11; se der 10 vira 0
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(n[tamanho])) return false;
  }
  return true;
}

// nome: só letras e espaços, entre 15 e 80 caracteres
function validarNome(valor) {
  const nome = valor.trim().replace(/\s+/g, " ");
  if (nome === "") return "Informe o nome completo.";
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(nome)) return "Use apenas letras no nome.";
  if (nome.length < 15) return "O nome deve ter pelo menos 15 caracteres.";
  if (nome.length > 80) return "O nome deve ter no máximo 80 caracteres.";
  return "";
}

function validarCPF(valor) {
  if (somenteDigitos(valor).length !== 11) return "Digite os 11 números do CPF.";
  if (!cpfValido(valor)) return "CPF inválido. Confira os números digitados.";
  return "";
}

function validarCEP(valor) {
  return somenteDigitos(valor).length === 8 ? "" : "Digite um CEP com 8 números.";
}

// fixo: DDD + 8 números
function validarTelefoneFixo(valor) {
  return /^\(\+55\)\d{2}-\d{8}$/.test(valor) ? "" : "Use o formato (+55)XX-XXXXXXXX.";
}

// celular: DDD + 8 ou 9 números
function validarTelefoneCelular(valor) {
  return /^\(\+55\)\d{2}-\d{8,9}$/.test(valor) ? "" : "Use o formato (+55)XX-XXXXXXXX.";
}

// regra do usuário (login)
function validarLogin(valor) {
  return /^[A-Za-z]{10}$/.test(valor) ? "" : "O usuário deve ter exatamente 10 letras.";
}

// regra da senha
function validarSenha(valor) {
  return /^\d{8}$/.test(valor) ? "" : "A senha deve ter exatamente 8 dígitos numéricos.";
}

// mostra o erro embaixo do campo e deixa a borda vermelha (sem usar alert)
function mostrarErroCampo(campo, mensagem) {
  const aviso = document.getElementById(campo.id + "-erro");
  campo.classList.toggle("invalido", mensagem !== "");
  campo.setAttribute("aria-invalid", mensagem !== "");
  if (aviso) aviso.textContent = mensagem;
  return mensagem === "";
}


// e-mail: formato simples nome@dominio.com
function validarEmail(valor) {
  const email = valor.trim();
  if (email === "") return "Informe o e-mail.";
  if (email.length > 80) return "O e-mail deve ter no máximo 80 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email)) return "Digite um e-mail válido, como nome@exemplo.com.";
  return "";
}
