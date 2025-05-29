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
  const emailUsuario = (localStorage.getItem("loggedInUserEmail") || "").trim().toLowerCase();
  const quantidade = parseInt(document.getElementById("quantidade-tickets").value) || 1;

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
    // Recebe o usuário sem a senha
    const usuario = await resposta.json();

    // Atualizar tickets (adicionando a quantidade comprada)
    const ticketsAtualizados = (usuario.tickets || 0) + quantidade;

    // Atualizar usuário via PUT /usuarios/:email
    const atualizarResposta = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(emailUsuario)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: usuario.nome,
        // senha não é retornada pelo GET, então não envie senha aqui!
        tickets: ticketsAtualizados,
        viagens: usuario.viagens || 0,
        rotasFavoritas: usuario.rotasFavoritas || []
      })
    });

    if (!atualizarResposta.ok) {
      throw new Error("Erro ao salvar a compra no servidor.");
    }

    // Atualiza o localStorage para refletir os tickets atualizados
    let usuarioAtualizado = { ...usuario, tickets: ticketsAtualizados };
    localStorage.setItem("currentUser", JSON.stringify(usuarioAtualizado));

    const confirmacao = document.getElementById("confirmacao-compra");
    confirmacao.textContent = `Compra confirmada: ${quantidade} ticket(s)! Total de tickets: ${ticketsAtualizados}`;
    confirmacao.style.color = "green";

    setTimeout(() => {
      confirmacao.textContent = "";
    }, 3000);
  } catch (erro) {
    console.error("Erro na confirmação de pagamento:", erro);
    alert("Erro ao processar o pagamento. Tente novamente.");
  }
});
