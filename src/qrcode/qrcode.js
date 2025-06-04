document.addEventListener("DOMContentLoaded", async function () {
  const qrcodeContainer = document.getElementById("qrcode");
  const viagensRestantes = document.getElementById("viagens-restantes");
  const btnGerarQR = document.getElementById("generate-qrcode-btn");
  const msgStatus = document.getElementById("qrcode-msg");

  // Assume que o email do usuário logado é armazenado no localStorage
  const userEmail = localStorage.getItem("loggedInUserEmail");

  // Caminho para a imagem de QR Code estática
  // CERTIFIQUE-SE DE QUE ESTE CAMINHO ESTÁ CORRETO para onde sua imagem qrcode.png está!
  const staticQrCodePath = '../img/qrcode.png'; 

  // Função para carregar o número de tickets do usuário
  async function carregarTickets() {
    if (!userEmail) {
      console.log("Usuário não logado. Incapaz de carregar tickets.");
      viagensRestantes.innerText = `Tickets: 0`;
      return 0;
    }

    try {
      console.log(`Carregando tickets para o usuário: ${userEmail}`);
      const response = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(userEmail)}`);
      if (!response.ok) {
        // Se a resposta não for OK (ex: 404 Not Found), lança um erro
        throw new Error(`Erro ao carregar tickets: Status ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      viagensRestantes.innerText = `Tickets: ${data.tickets}`;
      console.log(`Tickets carregados: ${data.tickets}`);
      return data.tickets;
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
      viagensRestantes.innerText = `Tickets: Erro`;
      return 0;
    }
  }

  // Função para exibir a imagem de QR Code estática e usar um ticket
  async function gerarQRCode(event) {
    // PREVINE O COMPORTAMENTO PADRÃO DO BOTÃO (Ex: submissão de formulário, recarga de página)
    event.preventDefault(); 
    
    console.log("-----------------------------------------");
    console.log("FUNÇÃO gerarQRCode foi CHAMADA ao clicar no botão!");
    console.log("-----------------------------------------");

    msgStatus.innerText = "";  // Limpa mensagem de status antes de começar o processo
    try {
      console.log("1. Iniciando processo de exibição de QR Code estático.");

      // Carrega o número atual de tickets
      const tickets = await carregarTickets();
      console.log(`2. Tickets atuais disponíveis: ${tickets}`);

      // Verifica se há tickets disponíveis
      if (tickets <= 0) {
        msgStatus.innerText = "Você não possui tickets disponíveis!";
        msgStatus.style.color = "red";
        qrcodeContainer.innerHTML = ""; // Garante que a caixa do QR Code está vazia se não houver tickets
        console.log("3. Sem tickets disponíveis, não exibindo QR Code.");
        return; // Sai da função se não houver tickets
      }

      // Se há tickets, tenta usar um
      console.log("4. Fazendo requisição para usar um ticket...");
      const response = await fetch(`http://localhost:3000/usuarios/${encodeURIComponent(userEmail)}/usarticket`, {
        method: "PUT" // Método PUT para atualizar o recurso
      });

      if (!response.ok) {
        // Se a resposta da API não for OK, tenta ler o erro da resposta JSON
        const errorData = await response.json();
        throw new Error(`Erro ao usar ticket: Status ${response.status} - ${errorData.message || response.statusText}`);
      }

      // Se a requisição foi bem-sucedida, atualiza a contagem de tickets e exibe o QR Code
      const data = await response.json();
      viagensRestantes.innerText = `Tickets: ${data.ticketsRestantes}`;
      console.log(`5. Ticket usado com sucesso. Tickets restantes: ${data.ticketsRestantes}`);

      msgStatus.innerText = "QR Code exibido com sucesso!";
      msgStatus.style.color = "green";

      // --- Limpa o conteúdo anterior da div e insere a imagem estática do QR Code ---
      qrcodeContainer.innerHTML = ''; 
      const imgElement = document.createElement('img');
      imgElement.src = staticQrCodePath; // Define o caminho da imagem
      imgElement.alt = "QR Code"; // Texto alternativo para acessibilidade
      qrcodeContainer.appendChild(imgElement); // Adiciona a imagem à div

      console.log("6. Imagem de QR Code estático adicionada à tela.");

      // --- VERIFICAÇÃO DE DEBUG: Confirma que o QR Code permanece após 1 segundo ---
      setTimeout(() => {
          console.log("7. Verificando o conteúdo da qrcodeContainer após 1 segundo:");
          console.log("InnerHTML:", qrcodeContainer.innerHTML);
          console.log("Número de filhos:", qrcodeContainer.children.length);
          if (qrcodeContainer.children.length > 0 && qrcodeContainer.children[0].tagName === 'IMG') {
              console.log("   --> A imagem ainda está lá. Sucesso!");
          } else {
              console.log("   --> A imagem foi removida ou algo limpou a div (isso seria um problema, mas não deveria acontecer com este código).");
          }
      }, 1000); // Espera 1 segundo para verificar

    } catch (error) {
      // Captura e exibe qualquer erro que ocorra durante o processo
      console.error("Erro ABORTADO ao tentar exibir QR Code ou usar ticket (detalhes):", error);
      msgStatus.innerText = "Erro ao exibir QR Code.";
      msgStatus.style.color = "red";
    }
  }

  // Adiciona o event listener ao botão "Gerar novo QR CODE"
  btnGerarQR.addEventListener("click", gerarQRCode);

  // Carrega os tickets quando a página é carregada pela primeira vez
  carregarTickets();
});