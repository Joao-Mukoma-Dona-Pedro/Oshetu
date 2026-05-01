function normalizarTexto(valor) {
    return (valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function statusAluno(texto, tipo = "info") {
    const el = document.getElementById("feedbackAluno");
    if (!el) {
        return;
    }

    if (!texto) {
        el.textContent = "";
        el.className = "status-message";
        return;
    }

    el.textContent = texto;
    el.className = `status-message is-visible is-${tipo}`;
}

function resolveVideoPath(video) {
    if (!video) {
        return "";
    }

    if (/^https?:\/\//i.test(video) || /^(\/|\.\/|\.\.\/)/.test(video)) {
        return video;
    }

    return `../assets/videos/${video}`;
}

function aulaERecente(aula) {
    if (!aula.data) {
        return false;
    }

    const aulaDate = new Date(aula.data);
    const diff = Date.now() - aulaDate.getTime();
    return diff <= 1000 * 60 * 60 * 24 * 30;
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.tipo !== "aluno") {
        window.location.href = "login.html";
        return;
    }

    const welcome = document.getElementById("welcome");
    if (welcome) {
        welcome.textContent = `Bem-vindo, ${usuario.nome}`;
    }

    const container = document.getElementById("listaDisciplinas");
    const inputPesquisa = document.getElementById("pesquisaDisciplina");
    const resultadoPesquisa = document.getElementById("resultadoPesquisa");
    const toggleExpandir = document.getElementById("toggleExpandir");
    const filtros = Array.from(document.querySelectorAll("#filtrosAluno .chip"));

    let filtroAtivo = "todos";
    let expandirTudo = false;

    const professores = JSON.parse(localStorage.getItem("professores")) || [];

    function atualizarMetricas(lista) {
        const totalDisciplinas = lista.length;
        const todasAulas = lista.flatMap((professor) => professor.aulas || []);
        const comVideo = todasAulas.filter((aula) => aula.video).length;

        document.getElementById("disciplinasCount").textContent = totalDisciplinas;
        document.getElementById("aulasCount").textContent = todasAulas.length;
        document.getElementById("videosCount").textContent = comVideo;
    }

    function filtrarProfessores() {
        const termo = normalizarTexto(inputPesquisa.value);
        const filtrados = professores.filter((professor) => {
            const disciplinaMatch = normalizarTexto(professor.disciplina).includes(termo);
            const nomeMatch = normalizarTexto(professor.nome).includes(termo);

            if (!termo && filtroAtivo === "todos") {
                return true;
            }

            const aulas = professor.aulas || [];
            const temVideo = aulas.some((aula) => aula.video);
            const temPdf = aulas.some((aula) => aula.pdfs && aula.pdfs.length > 0);
            const recente = aulas.some((aula) => aulaERecente(aula));

            const matchFiltro =
                filtroAtivo === "todos" ||
                (filtroAtivo === "video" && temVideo) ||
                (filtroAtivo === "pdf" && temPdf) ||
                (filtroAtivo === "recentes" && recente);

            return (disciplinaMatch || nomeMatch || !termo) && matchFiltro;
        });

        if (resultadoPesquisa) {
            resultadoPesquisa.textContent = `${filtrados.length} disciplina(s) encontrada(s).`;
        }

        return filtrados;
    }

    function renderizarLista() {
        const lista = filtrarProfessores();
        atualizarMetricas(lista);
        container.innerHTML = "";

        if (professores.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    Ainda nao existem disciplinas disponiveis. Assim que um professor criar o perfil e publicar aulas,
                    elas aparecerao aqui.
                </div>
            `;
            statusAluno("Ainda nao ha dados docentes publicados.", "info");
            return;
        }

        if (lista.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    Nenhuma disciplina corresponde aos filtros atuais. Tenta outro termo ou muda o filtro.
                </div>
            `;
            statusAluno("Nao encontramos resultados para a pesquisa atual.", "info");
            return;
        }

        statusAluno("Explora as disciplinas e expande as aulas que quiseres consultar.", "success");

        lista.forEach((professor) => {
            const aulas = professor.aulas || [];
            const card = document.createElement("article");
            card.className = "disciplina-card";

            card.innerHTML = `
                <div class="disciplina-header">
                    <div>
                        <h3>${professor.disciplina || "Disciplina sem nome"}</h3>
                        <p class="professor-nome">Professor: ${professor.nome}</p>
                    </div>
                    <div class="disciplina-meta">
                        <span class="meta-pill">${aulas.length} aula(s)</span>
                        <span class="meta-pill">${aulas.filter((aula) => aula.video).length} com video</span>
                    </div>
                </div>
                <p>${professor.resumo || "Sem resumo disponivel para esta disciplina."}</p>
                <div class="disciplina-actions">
                    <span class="helper-text">Explora os recursos publicados nesta disciplina.</span>
                    <button class="btn-ver-aulas" type="button">Ver aulas</button>
                </div>
                <div class="aulas-container"></div>
            `;

            const botao = card.querySelector(".btn-ver-aulas");
            const aulasContainer = card.querySelector(".aulas-container");

            function renderizarAulas(expandir = false) {
                aulasContainer.innerHTML = "";

                if (!expandir) {
                    aulasContainer.classList.remove("ativo");
                    botao.textContent = "Ver aulas";
                    return;
                }

                aulasContainer.classList.add("ativo");
                botao.textContent = "Ocultar aulas";

                if (aulas.length === 0) {
                    aulasContainer.innerHTML = `<p class="disciplina-empty">Sem aulas disponiveis nesta disciplina.</p>`;
                    return;
                }

                aulas.forEach((aula) => {
                    const aulaCard = document.createElement("article");
                    aulaCard.className = "card-aula";

                    const pdfs = aula.pdfs || [];
                    const resources = pdfs.length > 0
                        ? pdfs.map((pdf) => `<span class="resource-pill">PDF: ${pdf}</span>`).join("")
                        : `<span class="resource-pill">Sem PDFs</span>`;

                    const videoPath = resolveVideoPath(aula.video);
                    const isPreviewableVideo = /\.(mp4|webm|ogg)$/i.test(videoPath);
                    const videoMarkup = aula.video
                        ? isPreviewableVideo
                            ? `<video class="video-preview" controls src="${videoPath}"></video>`
                            : `<a class="resource-link" href="${videoPath}" target="_blank" rel="noopener noreferrer">Abrir video</a>`
                        : `<span class="resource-pill">Sem video</span>`;

                    aulaCard.innerHTML = `
                        <div class="aula-topline">
                            <h4>${aula.topico}</h4>
                            <span class="aula-data">${aula.data || "Sem data"}</span>
                        </div>
                        <p class="aula-descricao">${aula.descricao || "Sem descricao adicionada para esta aula."}</p>
                        <div class="resources">${resources}</div>
                        <div class="resources">${videoMarkup}</div>
                    `;

                    aulasContainer.appendChild(aulaCard);
                });
            }

            botao.addEventListener("click", () => {
                const ativo = aulasContainer.classList.contains("ativo");
                renderizarAulas(!ativo);
            });

            if (expandirTudo) {
                renderizarAulas(true);
            }

            container.appendChild(card);
        });
    }

    filtros.forEach((filtro) => {
        filtro.addEventListener("click", () => {
            filtroAtivo = filtro.dataset.filter;
            filtros.forEach((item) => item.classList.toggle("is-active", item === filtro));
            renderizarLista();
        });
    });

    inputPesquisa.addEventListener("input", renderizarLista);

    toggleExpandir.addEventListener("click", () => {
        expandirTudo = !expandirTudo;
        toggleExpandir.textContent = expandirTudo ? "Recolher tudo" : "Expandir tudo";
        renderizarLista();
    });

    renderizarLista();
});
