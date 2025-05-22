const valorUnitario = 4.40;

// Atualiza o valor total com base na quantidade
function atualizarValorTotal() {
    const quantidade = parseInt(document.getElementById("quantidade-tickets").value) || 1;
    const total = (quantidade * valorUnitario).toFixed(2);
    document.getElementById("valor-total").textContent = `Valor total: R$ ${total}`;
    return total;
}

// Copia a chave PIX e mostra mensagem
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

// Eventos
document.getElementById("quantidade-tickets").addEventListener("input", atualizarValorTotal);
document.getElementById("copy-pix-btn").addEventListener("click", copiarChavePix);

// Inicializa valor
atualizarValorTotal();
