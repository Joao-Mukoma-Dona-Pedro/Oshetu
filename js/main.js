document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Protege o dashboard
    if (window.location.pathname.includes("dashboard.html") && !usuario) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar nome no dashboard
    const welcome = document.getElementById("welcome");
    if (welcome && usuario) {
        welcome.innerText = "Bem-vindo, " + usuario.nome;
    }

    // Mostrar candidaturas
    const lista = JSON.parse(localStorage.getItem("candidaturas")) || [];
    const container = document.getElementById("listaCandidaturas");

    if (container) {
        container.innerHTML = "";

        if (lista.length === 0) {
            container.innerHTML = "<p>Sem candidaturas ainda.</p>";
        } else {
            lista.forEach(c => {
                const card = document.createElement("div");
                card.className = "card-item";

                card.innerHTML = `
                    <h3>${c.escola}</h3>
                    <p>Curso: ${c.curso}</p>
                    <p>Status: Pendente</p>
                `;

                container.appendChild(card);
            });
        }
    }
});

// Logout
function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}
