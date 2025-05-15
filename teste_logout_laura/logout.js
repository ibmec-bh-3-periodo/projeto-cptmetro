function configurarLogout() {
    const logoutButton = document.getElementById("logoutButton");
  
    if (logoutButton) {
      logoutButton.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        alert("Você saiu da conta.");
        window.location.href = "../login e registro/registro.html";
      });
    }
  }
  
  module.exports = { configurarLogout };
  