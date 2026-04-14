document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if(!usuario || usuario.tipo !== "professor") {
        window.location.href = "login.html";
        return;
    }

    const welcome = document.getElementById("welcome");
    if(welcome){
        welcome.innerText = `Bem-vindo, Prof. ${usuario.nome}`;
    }

    // Pega todos os professores do localStorage
    let professores = JSON.parse(localStorage.getItem("professores")) || [];

    // Procura perfil do professor logado pelo email
    let perfil = professores.find(p => p.email === usuario.email);

    const main = document.querySelector("main");

    // Se não existir perfil, criar formulário de perfil
    if(!perfil){
        main.innerHTML = `
            <h2>Crie seu Perfil</h2>
            <form id="formPerfil">
                <label>Resumo: <textarea id="resumo" required></textarea></label>
                <label>Disciplina: <input type="text" id="disciplina" required></label>
                <button type="submit">Salvar Perfil</button>
            </form>
        `;

        document.getElementById("formPerfil").addEventListener("submit", (e)=>{
            e.preventDefault();
            const resumo = document.getElementById("resumo").value.trim();
            const disciplina = document.getElementById("disciplina").value.trim();
            perfil = {nome: usuario.nome, email: usuario.email, disciplina, resumo, aulas: []};
            professores.push(perfil);
            localStorage.setItem("professores", JSON.stringify(professores));
            mostrarDashboard(perfil);
        });

    } else {
        mostrarDashboard(perfil);
    }

    function mostrarDashboard(perfil){
        main.innerHTML = `
            <section id="aulas">
                <h2>Minhas Aulas</h2>
                <div id="listaAulas" class="cards-container"></div>
                <button id="btnNovaAula">Adicionar Aula</button>
            </section>
        `;

        const container = document.getElementById("listaAulas");
        if(perfil.aulas.length === 0){
            container.innerHTML = "<p>Você ainda não tem aulas.</p>";
        } else {
            perfil.aulas.forEach((a, index) => {
                const card = document.createElement("div");
                card.className = "card-item";
                card.innerHTML = `
                    <h3>${a.topico}</h3>
                    <p>Data: ${a.data}</p>
                    <p>PDFs: ${a.pdfs.length ? a.pdfs.join(", ") : "Nenhum"}</p>
                    <p>Vídeo: ${a.video || "Nenhum"}</p>
                    <button class="editar-aula" data-index="${index}">Editar</button>
                `;
                container.appendChild(card);
            });
        }

        document.getElementById("btnNovaAula").addEventListener("click", ()=>{
            abrirFormularioNovaAula(perfil);
        });

        // Editar aula
        document.querySelectorAll(".editar-aula").forEach(btn=>{
            btn.addEventListener("click", ()=>{
                const index = btn.dataset.index;
                abrirFormularioNovaAula(perfil, index);
            });
        });
    }

    function abrirFormularioNovaAula(perfil, index = null){
        if(document.getElementById("formNovaAula")) return;

        main.insertAdjacentHTML("beforeend", `
            <div id="formNovaAula" class="form-aula">
                <h3>${index!==null?"Editar Aula":"Nova Aula"}</h3>
                <label>Tópico: <input type="text" id="topicoAula" required></label>
                <label>PDFs (múltiplos): <input type="file" id="pdfsAula" multiple></label>
                <label>Vídeo (opcional): <input type="file" id="videoAula" accept="video/*"></label>
                <button id="btnSalvarAula">Salvar Aula</button>
                <button id="btnCancelarAula">Cancelar</button>
            </div>
        `);

        if(index !== null){
            const aula = perfil.aulas[index];
            document.getElementById("topicoAula").value = aula.topico;
        }

        document.getElementById("btnCancelarAula").addEventListener("click", ()=>{
            document.getElementById("formNovaAula").remove();
        });

        document.getElementById("btnSalvarAula").addEventListener("click", ()=>{
            const topico = document.getElementById("topicoAula").value.trim();
            const inputPDFs = document.getElementById("pdfsAula");
            const pdfs = [];
            for(let i=0;i<inputPDFs.files.length;i++){
                pdfs.push(inputPDFs.files[i].name);
            }
            const inputVideo = document.getElementById("videoAula");
            const video = inputVideo.files.length>0 ? inputVideo.files[0].name : "";

            const aula = {topico, data: new Date().toISOString().split("T")[0], pdfs, video};

            if(index!==null){
                perfil.aulas[index] = aula;
            } else {
                perfil.aulas.push(aula);
            }

            // Atualiza localStorage
            professores = professores.map(p=>p.email===perfil.email?perfil:p);
            localStorage.setItem("professores", JSON.stringify(professores));

            document.getElementById("formNovaAula").remove();
            mostrarDashboard(perfil);
        });
    }

});