const valorUnitario = 4.40;

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
  const emailUsuario = localStorage.getItem("loggedInUserEmail");
  const quantidade = parseInt(document.getElementById("quantidade-tickets").value) || 1;
  const valorTotal = quantidade * valorUnitario;

  if (!emailUsuario) {
    alert("Usuário não está logado.");
    return;
  }

  try {
    // Buscar usuário pelo email (rota GET /usuarios/:email)
    const resposta = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(emailUsuario)}`);
    if (!resposta.ok) {
      alert("Usuário não encontrado.");
      return;
    }
    const usuario = await resposta.json();

    if (usuario.saldo === undefined || usuario.viagens === undefined) {
      alert("Dados do usuário inválidos.");
      return;
    }

    if (usuario.saldo < valorTotal) {
      alert(`Saldo insuficiente. Você tem R$ ${usuario.saldo.toFixed(2)} e precisa de R$ ${valorTotal.toFixed(2)}.`);
      return;
    }

    // Atualizar saldo e viagens localmente
    const saldoAtualizado = usuario.saldo - valorTotal;
    const viagensAtualizadas = usuario.viagens + quantidade;

    // Atualizar usuário via PUT /usuarios/:email
    const atualizarResposta = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(emailUsuario)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: usuario.nome, // manter o nome atual
        senha: usuario.senha, // manter a senha atual
        saldo: saldoAtualizado,
        viagens: viagensAtualizadas,
        rotasFavoritas: usuario.rotasFavoritas || []
      })
    });

    if (!atualizarResposta.ok) {
      throw new Error("Erro ao salvar a compra no servidor.");
    }

    const confirmacao = document.getElementById("confirmacao-compra");
    confirmacao.textContent = `Compra confirmada: ${quantidade} ticket(s)! Saldo restante: R$ ${saldoAtualizado.toFixed(2)}`;
    confirmacao.style.color = "green";

    setTimeout(() => {
      confirmacao.textContent = "";
    }, 3000);
  } catch (erro) {
    console.error("Erro na confirmação de pagamento:", erro);
    alert("Erro ao processar o pagamento. Tente novamente.");
  }
});
