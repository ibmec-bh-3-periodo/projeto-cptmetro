document.getElementById("forma-pagamento").addEventListener("change", function() {
    let selectedMethod = this.value;
    
 
    document.getElementById("form-container").style.display = "block";
    document.getElementById("pix-form").style.display = "none";
    document.getElementById("debito-form").style.display = "none";
    document.getElementById("credito-form").style.display = "none";
    

    if (selectedMethod === "pix") {
        document.getElementById("pix-form").style.display = "block";
    } else if (selectedMethod === "debito") {
        document.getElementById("debito-form").style.display = "block";
    } else if (selectedMethod === "credito") {
        document.getElementById("credito-form").style.display = "block";
    }
});

document.getElementById("submit-btn").addEventListener("click", function() {
    let selectedMethod = document.getElementById("forma-pagamento").value;
    let paymentData;

    if (selectedMethod === "pix") {
        paymentData = document.getElementById("pix-key").value;
        alert("Chave PIX cadastrada: " + paymentData);
    } else if (selectedMethod === "debito") {
        paymentData = {
            number: document.getElementById("debito-number").value,
            name: document.getElementById("debito-name").value,
            validade: document.getElementById("debito-validade").value
        };
        alert("Cartão de Débito cadastrado: " + JSON.stringify(paymentData));
    } else if (selectedMethod === "credito") {
        paymentData = {
            number: document.getElementById("credito-number").value,
            name: document.getElementById("credito-name").value,
            validade: document.getElementById("credito-validade").value,
            cvv: document.getElementById("credito-cvv").value
        };
        alert("Cartão de Crédito cadastrado: " + JSON.stringify(paymentData));
    } else {
        alert("Por favor, selecione um método de pagamento.");
    }
});


// Script para exibir a saudação
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const greetingMessage = document.getElementById("greetingMessage");
    
    if (greetingMessage && loggedInUser) {
        greetingMessage.textContent = `Bem-vindo ao Metrô, ${loggedInUser}!`;
    } else {
        greetingMessage.textContent = "Bem-vindo ao Metrô!";
    }
    });