const valorUnitario = 4.40;
let pixFoiCopiado = false;

function atualizarValorTotal() {
  let quantidade = parseInt(document.getElementById("quantidade-tickets").value);
  if (isNaN(quantidade) || quantidade < 1) {
    quantidade = 1;
    document.getElementById("quantidade-tickets").value = 1;
  }

  const total = (quantidade * valorUnitario).toFixed(2);
  document.getElementById("valor-total").textContent = `Valor total: R$ ${total}`;
  return total;
}

function copiarChavePix() {
  const pixKeyInput = document.getElementById("pix-key");
  pixKeyInput.select();
  pixKeyInput.setSelectionRange(0, 99999); // Para mobile

  navigator.clipboard.writeText(pixKeyInput.value).then(() => {
    pixFoiCopiado = true;  // Marca que copiou
    const msg = document.getElementById("copy-msg");
    msg.textContent = "Chave PIX copiada!";
    msg.style.color = "green";

    setTimeout(() => {
      msg.textContent = "";
    }, 2000);
  });
}

document.getElementById("quantidade-tickets").addEventListener("input", atualizarValorTotal);
document.getElementById("copy-pix-btn").addEventListener("click", copiarChavePix);
atualizarValorTotal();

document.getElementById("confirmar-pagamento-btn").addEventListener("click", async () => {
  if (!pixFoiCopiado) {
    alert("Por favor, copie a chave PIX antes de confirmar o pagamento.");
    return;
  }

  const emailUsuario = localStorage.getItem("loggedInUserEmail");
  const quantidade = parseInt(document.getElementById("quantidade-tickets").value) || 1;
  const valorTotal = quantidade * valorUnitario;

  if (!emailUsuario) {
    alert("Usuário não está logado.");
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/usuarios?email=${emailUsuario}`);
    const usuarios = await resposta.json();

    if (!usuarios.length) {
      alert("Usuário não encontrado.");
      return;
    }

    const usuario = usuarios[0];

    if (usuario.saldo < valorTotal) {
      alert(`Saldo insuficiente. Você tem R$ ${usuario.saldo.toFixed(2)} e precisa de R$ ${valorTotal.toFixed(2)}.`);
      return;
    }

    usuario.saldo -= valorTotal;
    usuario.viagens += quantidade;

    const atualizar = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    if (!atualizar.ok) {
      throw new Error("Erro ao salvar a compra no servidor.");
    }

    const confirmacao = document.getElementById("confirmacao-compra");
    confirmacao.textContent = `Compra confirmada: ${quantidade} ticket(s)! Saldo restante: R$ ${usuario.saldo.toFixed(2)}`;
    confirmacao.style.color = "green";

    // Reseta para exigir nova cópia numa próxima compra
    pixFoiCopiado = false;

    setTimeout(() => {
      confirmacao.textContent = "";
    }, 3000);
  } catch (erro) {
    console.error("Erro na confirmação de pagamento:", erro);
    alert("Erro ao processar o pagamento. Tente novamente.");
  }
});
