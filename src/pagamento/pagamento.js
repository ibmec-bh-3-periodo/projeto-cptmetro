const valorUnitario = 4.40;

function atualizarValorTotal() {
  let quantidade = parseInt(document.getElementById("quantidade-tickets").value);
  if (isNaN(quantidade) || quantidade < 1) {
    quantidade = 1;
    document.getElementById("quantidade-tickets").value = 1;
  }
  const total = (quantidade * valorUnitario).toFixed(2);
  document.getElementById("valor-total").textContent = `Valor total: R$ ${total}`;
}

function copiarChavePix() {
  const pixKeyInput = document.getElementById("pix-key");
  pixKeyInput.select();
  pixKeyInput.setSelectionRange(0, 99999); // para mobile

  navigator.clipboard.writeText(pixKeyInput.value).then(() => {
    const msg = document.getElementById("copy-msg");
    msg.textContent = "Chave PIX copiada!";
    msg.style.color = "green";
    setTimeout(() => {
      msg.textContent = "";
    }, 2000);
  }).catch(err => {
    console.error("Erro ao copiar chave PIX:", err);
  });
}

document.getElementById("quantidade-tickets").addEventListener("input", atualizarValorTotal);
document.getElementById("copy-pix-btn").addEventListener("click", copiarChavePix);
atualizarValorTotal();

document.getElementById("confirmar-pagamento-btn").addEventListener("click", async () => {
  const emailUsuario = (localStorage.getItem("loggedInUserEmail") || "").trim().toLowerCase();
  const quantidade = parseInt(document.getElementById("quantidade-tickets").value) || 1;

  if (!emailUsuario) {
    alert("Você precisa estar logado para comprar tickets!");
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(emailUsuario)}`);
    if (!resposta.ok) {
      alert("Usuário não encontrado.");
      return;
    }

    const usuario = await resposta.json();
    const ticketsAtualizados = quantidade;

    const atualizarResposta = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(emailUsuario)}/tickets`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets: ticketsAtualizados })
    });

    if (!atualizarResposta.ok) {
      throw new Error("Erro ao salvar a compra no servidor.");
    }

    // Atualiza o localStorage (se quiser)
    localStorage.setItem("loggedInUserTickets", ticketsAtualizados);

    const confirmacao = document.getElementById("confirmacao-compra");
    alert(`Pagamento confirmado!\nVocê comprou ${quantidade} ticket(s).\nAgora você tem ${(usuario.tickets || 0) + quantidade} tickets.`);
    confirmacao.textContent = `Compra confirmada: ${quantidade} ticket(s)! Total: ${ticketsAtualizados}`;
    confirmacao.style.color = "green";

    setTimeout(() => { confirmacao.textContent = ""; }, 3000);
  } catch (erro) {
    console.error("Erro na confirmação de pagamento:", erro);
    alert("Erro ao processar o pagamento. Tente novamente.");
  }
});

