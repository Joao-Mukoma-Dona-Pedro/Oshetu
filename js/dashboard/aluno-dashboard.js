function statusAluno(texto, tipo = "info") {
    const el = document.getElementById("feedbackAluno");
    if (!el) return;
    if (!texto) {
        el.textContent = "";
        el.className = "status-message";
        return;
    }
    el.textContent = texto;
    el.className = `status-message is-visible is-${tipo}`;
}

function setupTabs(tabContainerId) {
    const container = document.getElementById(tabContainerId);
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll(".tab-button"));
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((item) => item.classList.toggle("is-active", item === button));
            document.querySelectorAll(".tab-panel").forEach((panel) => {
                panel.classList.toggle("is-active", panel.id === button.dataset.tabTarget);
            });
        });
    });
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = window.OkwetuData.requireRole("aluno");
    if (!usuario) return;

    setupTabs("studentTabs");

    let activeLessonFilter = "all";
    let activeTaskFilter = "all";
    const stateUser = window.OkwetuData.getUserByEmail(usuario.email);
    let student = window.OkwetuData.getStudentByEmail(usuario.email);

    const welcome = document.getElementById("welcome");
const overviewTarget = document.getElementById("studentPlacement");
const chartTarget = document.getElementById("studentStatsChart");
const lessonsTarget = document.getElementById("listaDisciplinas");
const tasksTarget = document.getElementById("listaTarefas");
const inputPesquisa = document.getElementById("pesquisaDisciplina");

if (welcome) {
    welcome.textContent = `Bem-vindo, ${usuario.nome}`;
}

    function syncProfileVisuals() {
        const user = window.OkwetuData.getUserByEmail(usuario.email);
        student = window.OkwetuData.getStudentByEmail(usuario.email);
        document.getElementById("studentAvatar").src = user.avatar;
        document.getElementById("studentAvatarProfile").src = user.avatar;
        document.getElementById("studentProfileName").textContent = student.nome;
        document.getElementById("studentProfileRole").textContent = `${window.OkwetuData.getTrackDetails(student.perfil).label} | ${student.classe} | Turma ${student.turma}`;
        document.getElementById("studentBio").value = student.bio || "";
        document.getElementById("studentHeroTitle").textContent = `${student.nome}, acompanha o teu progresso e a tua turma em tempo real.`;
        document.getElementById("studentHeroText").textContent = student.bio || "A plataforma acompanha aulas vistas, trabalhos enviados e o teu progresso individual em tempo real.";
    }

    function updateTopMetrics() {
        const lessons = window.OkwetuData.getStudentLessons(student);
        const assignments = window.OkwetuData.getStudentAssignments(student);
        const watched = lessons.filter((item) => item.lesson.watchedBy.includes(student.email)).length;
        document.getElementById("disciplinasCount").textContent = [...new Set(lessons.map((item) => item.disciplina))].length;
        document.getElementById("aulasCount").textContent = `${watched}/${lessons.length}`;
        document.getElementById("videosCount").textContent = assignments.length;
    }

    function renderPlacement() {
        const track = window.OkwetuData.getTrackDetails(student.perfil);
        overviewTarget.innerHTML = `
            <article class="student-info-card">
                <span class="meta-pill">Perfil</span>
                <strong>${track.label}</strong>
                <p>Encaminhamento automatico para ${student.classe}.</p>
            </article>
            <article class="student-info-card">
                <span class="meta-pill">Classe</span>
                <strong>${student.classe}</strong>
                <p>Turma ${student.turma} com distribuicao equilibrada.</p>
            </article>
            <article class="student-info-card">
                <span class="meta-pill">Disciplinas</span>
                <strong>${track.disciplinas.length}</strong>
                <p>${track.disciplinas.join(", ")}</p>
            </article>
        `;
    }

    function renderChart() {
        const metrics = window.OkwetuData.calculateStudentMetrics(student.email);
        chartTarget.innerHTML = `
            <div class="progress-card">
                <div class="progress-copy">
                    <h3>Estatisticas pessoais</h3>
                    <p>Tu consegues acompanhar aulas vistas, tarefas enviadas e media atual.</p>
                </div>
                <div class="progress-bars">
                    <div class="progress-row">
                        <span>Aulas assistidas</span>
                        <strong>${metrics.aulasAssistidas}/${metrics.totalAulas}</strong>
                        <div class="progress-track"><span style="width:${metrics.totalAulas ? (metrics.aulasAssistidas / metrics.totalAulas) * 100 : 0}%"></span></div>
                    </div>
                    <div class="progress-row">
                        <span>Tarefas enviadas</span>
                        <strong>${metrics.entregas}/${metrics.totalTarefas}</strong>
                        <div class="progress-track"><span style="width:${metrics.totalTarefas ? (metrics.entregas / metrics.totalTarefas) * 100 : 0}%"></span></div>
                    </div>
                    <div class="progress-row">
                        <span>Media atual</span>
                        <strong>${metrics.media}/20</strong>
                        <div class="progress-track"><span style="width:${(metrics.media / 20) * 100}%"></span></div>
                    </div>
                    <div class="progress-row">
                        <span>Progresso geral</span>
                        <strong>${metrics.progresso}%</strong>
                        <div class="progress-track"><span style="width:${metrics.progresso}%"></span></div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderLessons(filter = "") {
        const entries = window.OkwetuData.getStudentLessons(student).filter((item) => {
            const watched = item.lesson.watchedBy.includes(student.email);
            const haystack = `${item.disciplina} ${item.teacherName} ${item.lesson.title}`.toLowerCase();
            const textMatch = haystack.includes(filter.toLowerCase());
            const stateMatch = activeLessonFilter === "all"
                || (activeLessonFilter === "watched" && watched)
                || (activeLessonFilter === "pending" && !watched);
            return textMatch && stateMatch;
        });

        if (!entries.length) {
            lessonsTarget.innerHTML = `<div class="empty-state">Nenhuma aula corresponde aos filtros atuais.</div>`;
            return;
        }

        lessonsTarget.innerHTML = entries
            .map((item) => {
                const watched = item.lesson.watchedBy.includes(student.email);
                return `
                    <article class="disciplina-card enhanced-card interactive-card">
                        <div class="disciplina-header">
                            <div class="teacher-chip">
                                <img src="${item.teacherAvatar}" alt="${item.teacherName}">
                                <div>
                                    <h3>${item.disciplina}</h3>
                                    <p class="professor-nome">${item.teacherName}</p>
                                </div>
                            </div>
                            <span class="meta-pill">${watched ? "Vista" : "Por ver"}</span>
                        </div>
                        <h4>${item.lesson.title}</h4>
                        <p class="aula-descricao">${item.lesson.summary}</p>
                        <div class="resources">
                            <span class="resource-pill">Data: ${item.lesson.date}</span>
                            <span class="resource-pill">Materiais: ${item.lesson.resources.join(", ") || "Sem anexos"}</span>
                        </div>
                        <p class="disciplina-empty">Video: ${item.lesson.video || "Sem video"}</p>
                        <button class="btn-ver-aulas marcar-aula" type="button" data-teacher="${item.teacherEmail}" data-lesson="${item.lesson.id}">
                            ${watched ? "Aula concluida" : "Marcar como vista"}
                        </button>
                    </article>
                `;
            })
            .join("");

        document.querySelectorAll(".marcar-aula").forEach((button) => {
            button.addEventListener("click", () => {
                window.OkwetuData.markLessonViewed(student.email, button.dataset.teacher, button.dataset.lesson);
                statusAluno("Aula marcada como vista com sucesso.", "success");
                refresh(inputPesquisa.value);
            });
        });
    }

    function renderTasks() {
        const assignments = window.OkwetuData.getStudentAssignments(student).filter((item) => {
            const submitted = Boolean(item.submission);
            return activeTaskFilter === "all"
                || (activeTaskFilter === "submitted" && submitted)
                || (activeTaskFilter === "pending" && !submitted);
        });

        if (!assignments.length) {
            tasksTarget.innerHTML = `<div class="empty-state">Nenhuma tarefa corresponde aos filtros atuais.</div>`;
            return;
        }

        tasksTarget.innerHTML = assignments
            .map((item) => `
                <article class="task-card interactive-card">
                    <div class="disciplina-header">
                        <div class="teacher-chip">
                            <img src="${item.teacherAvatar}" alt="${item.teacherName}">
                            <div>
                                <h3>${item.assignment.title}</h3>
                                <p class="professor-nome">${item.disciplina} com ${item.teacherName}</p>
                            </div>
                        </div>
                        <span class="meta-pill">${item.submission ? item.submission.status : "Pendente"}</span>
                    </div>
                    <p class="aula-descricao">${item.assignment.description}</p>
                    <div class="resources">
                        <span class="resource-pill">Prazo: ${item.assignment.deadline}</span>
                        <span class="resource-pill">Nota: ${item.submission?.score ?? "Aguardando"}</span>
                    </div>
                    <textarea class="task-textarea" data-teacher="${item.teacherEmail}" data-assignment="${item.assignment.id}" placeholder="Escreve aqui o resumo da tua entrega, link do trabalho ou observacoes...">${item.submission?.content || ""}</textarea>
                    <button class="btn-ver-aulas enviar-tarefa" type="button" data-teacher="${item.teacherEmail}" data-assignment="${item.assignment.id}">
                        ${item.submission ? "Atualizar entrega" : "Enviar tarefa"}
                    </button>
                </article>
            `)
            .join("");

        document.querySelectorAll(".enviar-tarefa").forEach((button) => {
            button.addEventListener("click", () => {
                const textarea = document.querySelector(`.task-textarea[data-teacher="${button.dataset.teacher}"][data-assignment="${button.dataset.assignment}"]`);
                const content = textarea.value.trim();
                if (!content) {
                    statusAluno("Escreve o conteudo da entrega antes de enviar.", "error");
                    return;
                }
                window.OkwetuData.submitAssignment(student.email, button.dataset.teacher, button.dataset.assignment, content);
                statusAluno("Tarefa enviada ao professor com sucesso.", "success");
                refresh(inputPesquisa.value);
            });
        });
    }


   async function saveProfile(event) {
    event.preventDefault();

    const file = document.getElementById("studentAvatarInput").files[0];

    const payload = {
        bio: document.getElementById("studentBio").value.trim(),
    };

    if (file) {
        payload.avatar = await fileToDataUrl(file);
    }

    window.OkwetuData.updateStudentProfile(usuario.email, payload);

    statusAluno("Perfil do aluno atualizado com sucesso.", "success");

    refresh(inputPesquisa.value);

    document.getElementById("studentAvatarInput").value = "";
}

function bindFilters() {
    document.querySelectorAll("[data-filter-lessons]").forEach((button) => {
        button.addEventListener("click", () => {
            activeLessonFilter = button.dataset.filterLessons;

            document
                .querySelectorAll("[data-filter-lessons]")
                .forEach((item) =>
                    item.classList.toggle("is-active", item === button)
                );

            renderLessons(inputPesquisa.value);
        });
    });

    document.querySelectorAll("[data-filter-tasks]").forEach((button) => {
        button.addEventListener("click", () => {
            activeTaskFilter = button.dataset.filterTasks;

            document
                .querySelectorAll("[data-filter-tasks]")
                .forEach((item) =>
                    item.classList.toggle("is-active", item === button)
                );

            renderTasks();
        });
    });
}

function refresh(filter = "") {
    syncProfileVisuals();
    updateTopMetrics();
    renderPlacement();
    renderChart();
    renderLessons(filter);
    renderTasks();
}

function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

inputPesquisa.addEventListener("input", () => {
    renderLessons(inputPesquisa.value);
});

document
    .getElementById("studentProfileForm")
    .addEventListener("submit", saveProfile);

bindFilters();

statusAluno(
    "O teu painel agora tem abas, foto de perfil e filtros para aulas e tarefas.",
    "success"
);

refresh();
});