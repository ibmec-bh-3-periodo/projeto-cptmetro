// Simulação de saldo e viagens restantes
let saldoAtual = 4.40;
let viagensRestantes = 1;

// Função para gerar QR Code
let qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 200,
    height: 200
});

function generateQRCode() {
    let dynamicData = `QR Code - Saldo: R$${saldoAtual.toFixed(2)}, Viagens: ${viagensRestantes}`;
    qrcode.makeCode(dynamicData); // Atualiza o QR Code com dados dinâmicos
}

document.getElementById("generate-qrcode-btn").addEventListener("click", generateQRCode);

// Função para recarregar saldo (simulada)
function recarregarSaldo() {
    // Simula uma recarga de saldo
    let saldoElement = document.getElementById('saldo');
    let currentSaldo = parseFloat(saldoElement.innerText.replace('R$', '').replace(',', '.'));
    let newSaldo = currentSaldo + 5;  // Adiciona R$ 5 ao saldo
    saldoElement.innerText = 'R$ ' + newSaldo.toFixed(2).replace('.', ',');

    // Exibe o mapa e as linhas quando o saldo for atualizado
    document.getElementById('mapa').style.display = 'block';
    document.getElementById('linhas').style.display = 'block';
}