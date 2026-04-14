const form = document.getElementById("formCandidatura");

if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        alert("Candidatura enviada!");

        window.location.href = "dashboard.html";
    });
}