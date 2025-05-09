function mostrarSaudacao() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const greetingMessage = document.getElementById("greetingMessage");
  
    if (greetingMessage && loggedInUser) {
      greetingMessage.textContent = `Bem-vindo ao Metrô, ${loggedInUser}!`;
    } else if (greetingMessage) {
      greetingMessage.textContent = "Bem-vindo ao Metrô!";
    }
  }
  
module.exports = { mostrarSaudacao };