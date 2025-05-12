let saldoAtual = 4.40;

function atualizarSaldo(valor) {
    saldoAtual += valor;
    const saldoElemento = document.getElementById("saldo-valor");
    if (saldoElemento) {
        saldoElemento.innerText = ⁠ R$${saldoAtual.toFixed(2)} ⁠;
    }
}
module.exports = {
    atualizarSaldo,
};