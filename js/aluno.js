document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if(!usuario || usuario.tipo !== "aluno"){
        window.location.href = "login.html";
        return;
    }

    const welcome = document.getElementById("welcome");
    if(welcome) welcome.innerText = `Bem-vindo, ${usuario.nome}`;
    const conteudos = [
        { título: "Equações", classe: "10"},
        { título: "Funções", classe: "10"},
        { título: "Leis de Newton", classe: "11"},
        { título: "Energia", classe: "11"},
        { título: "Derivação e integração", classe: "12"}
        ];
    function mudarclasse(classe) {
        document.getElementById("título-classe").innerText = "classe "+ "ª";
        const filtrados = Conteudos.filter(c=> c.classe === classe);
        const div = 
            document.getElementById("conteudos");
        div.innertHTML = "";
        filtrados.forEach(c => {
            div.innerHTML += '<P>${C.título}</p>';
        });
        }
            

    const container = document.getElementById("listaDisciplinas");
    const inputPesquisa = document.getElementById("pesquisaDisciplina");

    let professores = JSON.parse(localStorage.getItem("professores")) || [];

    function renderDisciplinas(lista){
        container.innerHTML = "";
        if(lista.length===0){
            container.innerHTML = "<p>Nenhuma disciplina disponível.</p>";
            return;
        }

        lista.forEach(prof=>{
            const card = document.createElement("div");
            card.className = "card-item disciplina-card";
            card.innerHTML = `
                <h3>${prof.disciplina}</h3>
                <p class="professor-nome">Professor: ${prof.nome}</p>
                <button class="btn-ver-aulas">Ver Aulas</button>
                <div class="aulas-container"></div>
            `;
            container.appendChild(card);

            const btn = card.querySelector(".btn-ver-aulas");
            const aulasContainer = card.querySelector(".aulas-container");

            btn.addEventListener("click", ()=>{
                if(aulasContainer.classList.contains("ativo")){
                    aulasContainer.classList.remove("ativo");
                    aulasContainer.innerHTML = "";
                    return;
                }
                aulasContainer.classList.add("ativo");
                aulasContainer.innerHTML = "";

                if(!prof.aulas || prof.aulas.length===0){
                    aulasContainer.innerHTML = "<p>Sem aulas disponíveis.</p>";
                    return;
                }

                prof.aulas.forEach(aula=>{
                    const aulaCard = document.createElement("div");
                    aulaCard.className = "card-aula";
                    aulaCard.innerHTML = `
                        <h4>${aula.topico}</h4>
                        <p class="data">📅 ${aula.data}</p>
                        <div class="pdfs">
                            ${
                                aula.pdfs && aula.pdfs.length>0 
                                ? aula.pdfs.map(p=>`<span class="pdf-link">📄 ${p}</span>`).join("")
                                : "<p>Sem PDFs</p>"
                            }
                        </div>
                        <div class="video">
                            ${
                                aula.video 
                                ? `<video controls src="assets/videos/${aula.video}"></video>`
                                : "<p>Sem vídeo</p>"
                            }
                        </div>
                    `;
                    aulasContainer.appendChild(aulaCard);
                });
            });
        });
    }

    renderDisciplinas(professores);

    // Pesquisa
    if(inputPesquisa){
        inputPesquisa.addEventListener("input", ()=>{
            const termo = inputPesquisa.value.toLowerCase();
            const filtrado = professores.filter(p=>
                p.disciplina.toLowerCase().includes(termo) ||
                p.nome.toLowerCase().includes(termo)
            );
            renderDisciplinas(filtrado);
        });
    }
});

// Logout
function logout(){
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}
