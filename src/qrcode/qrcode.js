document.addEventListener("DOMContentLoaded", async function () {
  const qrcodeContainer = document.getElementById("qrcode");
  const viagensRestantes = document.getElementById("viagens-restantes");
  const btnGerarQR = document.getElementById("generate-qrcode-btn");
  const msgStatus = document.getElementById("qrcode-msg");

  const userEmail = localStorage.getItem("loggedInUserEmail");

  async function carregarTickets() {
    if (!userEmail) {
      console.log("Usuário não logado.");
      viagensRestantes.innerText = `Tickets: 0`;
      return 0;
    }

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(userEmail)}`);
      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      viagensRestantes.innerText = `Tickets: ${data.tickets}`;
      return data.tickets;
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
      viagensRestantes.innerText = `Tickets: Erro`;
      return 0;
    }
  }

  async function gerarQRCode() {
    msgStatus.innerText = "";  // Limpa mensagem antes de começar
    try {
      const tickets = await carregarTickets();

      if (tickets <= 0) {
        msgStatus.innerText = "Você não possui tickets disponíveis!";
        msgStatus.style.color = "red";
        qrcodeContainer.innerHTML = "";
        console.log("Sem tickets disponíveis");
        return;
      }

      const response = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(userEmail)}/usarticket`, {
        method: "PUT"
      });

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();

      viagensRestantes.innerText = `Tickets: ${data.tickets}`;

      msgStatus.innerText = "QR Code gerado com sucesso!";
      msgStatus.style.color = "green";

      // Limpa QR anterior
      qrcodeContainer.innerHTML = "";

      const textoQRCode = `${userEmail} - Ticket válido em ${new Date().toLocaleString()}`;

      // Gera o QR code
      new QRCode(qrcodeContainer, {
        text: textoQRCode,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      console.log("QR Code gerado com texto:", textoQRCode);

    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      msgStatus.innerText = "Erro ao gerar QR Code.";
      msgStatus.style.color = "red";
    }
  }

  btnGerarQR.addEventListener("click", gerarQRCode);

  // Só carrega os tickets ao abrir a página, sem alterar msgStatus
  carregarTickets();
});
