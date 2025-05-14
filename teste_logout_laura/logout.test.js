const { configurarLogout } = require("./logout");

describe("Botão de Sair da Conta", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <a href="../login e registro/registro.html" class="box" id="logoutButton">
        <img src="../icones/sair.png" alt="Ícone de sair da conta"> Sair da Conta
      </a>
    `;

    localStorage.setItem("loggedInUser", "Maria");

    // Mock do alert
    global.alert = jest.fn();

    // Mock do redirecionamento
    delete window.location;
    window.location = { href: "" };

    // Configura o evento de logout
    configurarLogout();
  });

  test("deve remover o usuário, exibir alerta e redirecionar ao clicar no botão", () => {
    const botao = document.getElementById("logoutButton");
    botao.click();

    // Verifica se o usuário foi removido
    expect(localStorage.getItem("loggedInUser")).toBeNull();

    // Verifica se o alert foi chamado
    expect(alert).toHaveBeenCalledWith("Você saiu da conta.");

    // Verifica se redirecionou para a página correta
    expect(window.location.href).toBe("../login e registro/registro.html");
  });
});
