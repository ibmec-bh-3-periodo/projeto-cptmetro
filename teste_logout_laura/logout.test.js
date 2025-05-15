const { configurarLogout } = require("./logout");

describe("Botão de Sair da Conta", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <a href="../login e registro/registro.html" class="box" id="logoutButton">
        <img src="../icones/sair.png" alt="Ícone de sair da conta"> Sair da Conta
      </a>
    `;

    localStorage.setItem("loggedInUser", "Maria");
    global.alert = jest.fn();
    delete window.location;
    window.location = { href: "" };

    configurarLogout();
  });

  test("deve remover o usuário, exibir alerta e redirecionar ao clicar no botão", () => {
    const botao = document.getElementById("logoutButton");
    botao.click();

    expect(localStorage.getItem("loggedInUser")).toBeNull();
    expect(alert).toHaveBeenCalledWith("Você saiu da conta.");
    expect(window.location.href).toBe("../login e registro/registro.html");
  });
});
