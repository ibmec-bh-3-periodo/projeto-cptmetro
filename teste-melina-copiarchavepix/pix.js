function copiarChavePix() {
    const pixKeyInput = document.getElementById("pix-key");
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999);
  
    navigator.clipboard.writeText(pixKeyInput.value).then(() => {
      const msg = document.getElementById("copy-msg");
      msg.textContent = "Chave PIX copiada!";
      msg.style.color = "green";
  
      setTimeout(() => {
        msg.textContent = "";
      }, 2000);
    });
  }
  
  module.exports = { copiarChavePix };
  