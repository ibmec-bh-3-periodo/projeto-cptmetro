function generateQRCode(containerId, saldo, viagens) {
    const container = document.getElementById(containerId);
    const qrContent = `QR Code - Saldo: R$${saldo.toFixed(1)}, Viagens: ${viagens}`;
    
    
    const div = document.createElement("div");
    div.className = "qrcode-box";
    div.textContent = qrContent;

    container.innerHTML = ""; 
    container.appendChild(div);

    return qrContent; 
}

module.exports = { generateQRCode };

