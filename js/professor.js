function normalizarProfessorTexto(valor) {
    return (valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function showProfessorStatus(texto, tipo = "info") {
    const el = document.getElementById("feedbackProfessor");
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

function getProfessores() {
    return JSON.parse(localStorage.getItem("professores")) || [];
}

function saveProfessores(lista) {
    localStorage.setItem("professores", JSON.stringify(lista));
}

function aulaRecenteProfessor(aula) {
    if (!aula.data) {
        return false;
    }

    const aulaDate = new Date(aula.data);
    const diff = Date.now() - aulaDate.getTime();
    return diff <= 1000 * 60 * 60 * 24 * 30;
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.tipo !== "professor") {
        window.location.href = "login.html";
        return;
    }

    const welcome = document.getElementById("welcome");
    if (welcome) {
        welcome.textContent = `Bem-vindo, Prof. ${usuario.nome}`;
    }

    const perfilArea = document.getElementById("perfilArea");
    const formArea = document.getElementById("formArea");
    const listaAulas = document.getElementById("listaAulas");
    const pesquisaAula = document.getElementById("pesquisaAula");
    const filtros = Array.from(document.querySelectorAll("#filtrosProfessor .chip"));
    const btnEditarPerfil = document.getElementById("btnEditarPerfil");
    const btnNovaAula = document.getElementById("btnNovaAula");

    let professores = getProfessores();
    let perfil = professores.find((item) => item.email === usuario.email) || null;
    let filtroAtivo = "todos";
    let editandoIndice = null;

    function atualizarColecao() {
        professores = professores.filter((item) => item.email !== usuario.email);
        professores.push(perfil);
        saveProfessores(professores);
    }

    function atualizarMetricas() {
        const aulas = perfil?.aulas || [];
        const totalPdfs = aulas.reduce((acc, aula) => acc + (aula.pdfs?.length || 0), 0);
        const totalVideos = aulas.filter((aula) => aula.video).length;

        document.getElementById("totalAulas").textContent = aulas.length;
        document.getElementById("totalPdfs").textContent = totalPdfs;
        document.getElementById("totalVideos").textContent = totalVideos;
    }

    function renderizarPerfil() {
        if (!perfil) {
            perfilArea.innerHTML = `
                <div class="profile-card">
                    <span class="eyebrow">Primeiro passo</span>
                    <h3>Cria o teu perfil docente</h3>
                    <p>Adiciona disciplina e resumo para comecar a publicar aulas no Oshetu.</p>
                </div>
            `;
            return;
        }

        perfilArea.innerHTML = `
            <article class="profile-card">
                <span class="eyebrow">Perfil docente</span>
                <h3>${perfil.disciplina || "Disciplina ainda nao definida"}</h3>
                <p>${perfil.resumo || "Ainda nao existe um resumo para o teu perfil."}</p>
                <p class="inline-note">Professor responsavel: ${perfil.nome}</p>
            </article>
        `;
    }

    function renderizarFormularioPerfil() {
        const disciplina = perfil?.disciplina || "";
        const resumo = perfil?.resumo || "";

        formArea.innerHTML = `
            <form id="formPerfil" class="lesson-form">
                <h3>${perfil ? "Atualizar perfil" : "Criar perfil"}</h3>
                <div class="lesson-form-grid">
                    <label class="field" for="disciplinaPerfil">
                        <span>Disciplina</span>
                        <input id="disciplinaPerfil" type="text" value="${disciplina}" required>
                    </label>
                    <label class="field" for="resumoPerfil">
                        <span>Resumo docente</span>
                        <textarea id="resumoPerfil" required>${resumo}</textarea>
                    </label>
                </div>
                <div class="form-actions">
                    <button type="submit" class="primary-button">Guardar perfil</button>
                    ${perfil ? '<button type="button" id="cancelarPerfil" class="ghost-button">Cancelar</button>' : ""}
                </div>
            </form>
        `;

        const formPerfil = document.getElementById("formPerfil");
        formPerfil.addEventListener("submit", (event) => {
            event.preventDefault();

            const disciplinaInput = document.getElementById("disciplinaPerfil").value.trim();
            const resumoInput = document.getElementById("resumoPerfil").value.trim();

            if (!disciplinaInput || !resumoInput) {
                showProfessorStatus("Preenche disciplina e resumo para guardar o perfil.", "error");
                return;
            }

            perfil = perfil || { nome: usuario.nome, email: usuario.email, aulas: [] };
            perfil.nome = usuario.nome;
            perfil.email = usuario.email;
            perfil.disciplina = disciplinaInput;
            perfil.resumo = resumoInput;
            perfil.aulas = perfil.aulas || [];

            atualizarColecao();
            renderizarPerfil();
            atualizarMetricas();
            renderizarListaAulas();
            formArea.innerHTML = "";
            showProfessorStatus("Perfil guardado com sucesso.", "success");
        });

        const cancelarPerfil = document.getElementById("cancelarPerfil");
        if (cancelarPerfil) {
            cancelarPerfil.addEventListener("click", () => {
                formArea.innerHTML = "";
                showProfessorStatus("Edicao de perfil cancelada.", "info");
            });
        }
    }

    function renderizarFormularioAula(indice = null) {
        if (!perfil) {
            showProfessorStatus("Cria primeiro o teu perfil docente para adicionar aulas.", "error");
            renderizarFormularioPerfil();
            return;
        }

        editandoIndice = indice;
        const aula = indice !== null ? perfil.aulas[indice] : { topico: "", data: "", descricao: "", pdfs: [], video: "" };

        formArea.innerHTML = `
            <form id="formAula" class="lesson-form">
                <h3>${indice !== null ? "Editar aula" : "Nova aula"}</h3>
                <div class="lesson-form-grid">
                    <label class="field" for="topicoAula">
                        <span>Topico</span>
                        <input id="topicoAula" type="text" value="${aula.topico || ""}" required>
                    </label>
                    <label class="field" for="dataAula">
                        <span>Data</span>
                        <input id="dataAula" type="date" value="${aula.data || ""}" required>
                    </label>
                </div>
                <label class="field" for="descricaoAula">
                    <span>Descricao</span>
                    <textarea id="descricaoAula" placeholder="Explica rapidamente o foco desta aula.">${aula.descricao || ""}</textarea>
                </label>
                <div class="lesson-form-grid">
                    <label class="field" for="pdfsAula">
                        <span>PDFs</span>
                        <input id="pdfsAula" type="text" value="${(aula.pdfs || []).join(", ")}" placeholder="Ex.: resumo1.pdf, atividade2.pdf">
                    </label>
                    <label class="field" for="videoAula">
                        <span>Video</span>
                        <input id="videoAula" type="text" value="${aula.video || ""}" placeholder="Nome do ficheiro ou URL do video">
                    </label>
                </div>
                <div class="form-actions">
                    <button type="submit" class="primary-button">Guardar aula</button>
                    <button type="button" id="cancelarAula" class="ghost-button">Cancelar</button>
                </div>
            </form>
        `;

        document.getElementById("formAula").addEventListener("submit", (event) => {
            event.preventDefault();

            const topico = document.getElementById("topicoAula").value.trim();
            const data = document.getElementById("dataAula").value;
            const descricao = document.getElementById("descricaoAula").value.trim();
            const pdfs = document.getElementById("pdfsAula").value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
            const video = document.getElementById("videoAula").value.trim();

            if (!topico || !data) {
                showProfessorStatus("Topico e data sao obrigatorios para guardar a aula.", "error");
                return;
            }

            const novaAula = { topico, data, descricao, pdfs, video };
            if (editandoIndice !== null) {
                perfil.aulas[editandoIndice] = novaAula;
                showProfessorStatus("Aula atualizada com sucesso.", "success");
            } else {
                perfil.aulas.push(novaAula);
                showProfessorStatus("Nova aula adicionada com sucesso.", "success");
            }

            atualizarColecao();
            atualizarMetricas();
            renderizarListaAulas();
            formArea.innerHTML = "";
            editandoIndice = null;
        });

        document.getElementById("cancelarAula").addEventListener("click", () => {
            formArea.innerHTML = "";
            editandoIndice = null;
            showProfessorStatus("Edicao de aula cancelada.", "info");
        });
    }

    function obterAulasFiltradas() {
        if (!perfil) {
            return [];
        }

        const termo = normalizarProfessorTexto(pesquisaAula.value);
        return (perfil.aulas || []).filter((aula) => {
            const topicoMatch = normalizarProfessorTexto(aula.topico).includes(termo);
            const dataMatch = normalizarProfessorTexto(aula.data).includes(termo);
            const hasVideo = Boolean(aula.video);
            const hasPdf = Boolean(aula.pdfs && aula.pdfs.length > 0);
            const recente = aulaRecenteProfessor(aula);

            const matchFiltro =
                filtroAtivo === "todos" ||
                (filtroAtivo === "video" && hasVideo) ||
                (filtroAtivo === "pdf" && hasPdf) ||
                (filtroAtivo === "recentes" && recente);

            return (topicoMatch || dataMatch || !termo) && matchFiltro;
        });
    }

    function renderizarListaAulas() {
        listaAulas.innerHTML = "";

        if (!perfil) {
            listaAulas.innerHTML = `
                <div class="empty-state">
                    O teu dashboard vai aparecer aqui assim que criares o perfil docente.
                </div>
            `;
            return;
        }

        const aulas = obterAulasFiltradas();

        if (perfil.aulas.length === 0) {
            listaAulas.innerHTML = `
                <div class="empty-state">
                    Ainda nao tens aulas publicadas. Usa o botao "Adicionar aula" para comecar.
                </div>
            `;
            return;
        }

        if (aulas.length === 0) {
            listaAulas.innerHTML = `
                <div class="empty-state">
                    Nenhuma aula corresponde aos filtros atuais. Ajusta a pesquisa ou muda o filtro.
                </div>
            `;
            return;
        }

        aulas.forEach((aula) => {
            const indiceReal = perfil.aulas.findIndex((item) =>
                item.topico === aula.topico &&
                item.data === aula.data &&
                item.descricao === aula.descricao
            );

            const lessonCard = document.createElement("article");
            lessonCard.className = "lesson-card";

            const pdfTags = (aula.pdfs || []).length > 0
                ? aula.pdfs.map((pdf) => `<li>${pdf}</li>`).join("")
                : "<li>Nenhum PDF adicionado.</li>";

            lessonCard.innerHTML = `
                <div class="lesson-card-header">
                    <div>
                        <h3>${aula.topico}</h3>
                        <p>${aula.descricao || "Sem descricao para esta aula."}</p>
                    </div>
                    <span class="lesson-date">${aula.data}</span>
                </div>
                <div class="resource-summary">
                    <span class="resource-tag">${(aula.pdfs || []).length} PDF(s)</span>
                    <span class="resource-tag">${aula.video ? "Com video" : "Sem video"}</span>
                </div>
                <ul class="resource-list">${pdfTags}</ul>
                <p class="inline-note">Video: ${aula.video || "Nao definido"}</p>
                <div class="lesson-card-actions">
                    <button type="button" class="ghost-button" data-action="editar" data-index="${indiceReal}">Editar</button>
                    <button type="button" class="secondary-button" data-action="remover" data-index="${indiceReal}">Remover</button>
                </div>
            `;

            listaAulas.appendChild(lessonCard);
        });

        listaAulas.querySelectorAll("[data-action='editar']").forEach((button) => {
            button.addEventListener("click", () => {
                renderizarFormularioAula(Number(button.dataset.index));
            });
        });

        listaAulas.querySelectorAll("[data-action='remover']").forEach((button) => {
            button.addEventListener("click", () => {
                const indice = Number(button.dataset.index);
                perfil.aulas.splice(indice, 1);
                atualizarColecao();
                atualizarMetricas();
                renderizarListaAulas();
                showProfessorStatus("Aula removida com sucesso.", "success");
            });
        });
    }

    filtros.forEach((filtro) => {
        filtro.addEventListener("click", () => {
            filtroAtivo = filtro.dataset.filter;
            filtros.forEach((item) => item.classList.toggle("is-active", item === filtro));
            renderizarListaAulas();
        });
    });

    pesquisaAula.addEventListener("input", renderizarListaAulas);
    btnEditarPerfil.addEventListener("click", renderizarFormularioPerfil);
    btnNovaAula.addEventListener("click", () => renderizarFormularioAula());

    renderizarPerfil();
    atualizarMetricas();
    renderizarListaAulas();

    if (!perfil) {
        renderizarFormularioPerfil();
        showProfessorStatus("Completa o teu perfil docente para comecar.", "info");
    } else {
        showProfessorStatus("Perfil carregado. Podes gerir aulas e recursos abaixo.", "success");
    }
});
