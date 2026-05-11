function setupTeacherTabs() {
    const buttons = Array.from(document.querySelectorAll("#teacherTabs .tab-button"));
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

document.addEventListener("DOMContentLoaded", async () => {
    await window.OshetuAuthService?.ready?.();
    await window.OshetuDatabaseService?.hydrateLocalCache?.();

    const usuario = window.OshetuAuthService?.requireRole?.("professor") || window.OkwetuData.requireRole("professor");
    if (!usuario) return;

    setupTeacherTabs();

    const welcome = document.getElementById("welcome");
    const profileTarget = document.getElementById("teacherProfileBoard");
    const chartTarget = document.getElementById("teacherChart");
    const interactionsTarget = document.getElementById("teacherInteractions");
    const lessonsTarget = document.getElementById("listaAulas");
    const submissionsTarget = document.getElementById("listaRecebimentos");
    const filterTeacherClass = document.getElementById("filterTeacherClass");
    const filterTeacherTurma = document.getElementById("filterTeacherTurma");
    const aulaClasse = document.getElementById("aulaClasse");
    const aulaTurma = document.getElementById("aulaTurma");
    const tarefaClasse = document.getElementById("tarefaClasse");
    const tarefaTurma = document.getElementById("tarefaTurma");

    let selectedClass = "Todas";
    let selectedTurma = "Todas";

    if (welcome) {
        welcome.textContent = `Bem-vindo, ${usuario.nome}`;
    }

    function statusProfessor(texto, tipo = "info") {
        const el = document.getElementById("feedbackProfessor");
        if (!el) return;
        if (!texto) {
            el.textContent = "";
            el.className = "status-message";
            return;
        }
        el.textContent = texto;
        el.className = `status-message is-visible is-${tipo}`;
    }

    function populateSelect(select, values, includeAll = false, current = "") {
        const options = [];
        if (includeAll) {
            options.push('<option value="Todas">Todas</option>');
        }
        values.forEach((value) => {
            options.push(`<option value="${value}">${value}</option>`);
        });
        select.innerHTML = options.join("");
        select.value = current && options.some((item) => item.includes(`value="${current}"`)) ? current : select.options[0].value;
    }

    function initAudienceSelectors() {
        const dashboard = window.OkwetuData.getTeacherDashboard(usuario.email);
        if (!dashboard) return;
        const teacher = dashboard.teacher;
        populateSelect(filterTeacherClass, teacher.classes, true, selectedClass);
        populateSelect(filterTeacherTurma, teacher.turmas, true, selectedTurma);
        populateSelect(aulaClasse, teacher.classes, false, teacher.classes[0]);
        populateSelect(aulaTurma, teacher.turmas, false, teacher.turmas[0]);
        populateSelect(tarefaClasse, teacher.classes, false, teacher.classes[0]);
        populateSelect(tarefaTurma, teacher.turmas, false, teacher.turmas[0]);
        selectedClass = filterTeacherClass.value;
        selectedTurma = filterTeacherTurma.value;
    }

    function syncProfileVisuals(dashboard) {
        const { teacher, teacherUser } = dashboard;
        document.getElementById("teacherAvatar").src = teacherUser.avatar;
        document.getElementById("teacherAvatarProfile").src = teacherUser.avatar;
        document.getElementById("teacherProfileName").textContent = teacher.nome;
        document.getElementById("teacherProfileRole").textContent = `${teacher.disciplina} | ${teacher.classes.join(", ")}`;
        document.getElementById("teacherDiscipline").value = teacher.disciplina;
        document.getElementById("teacherResumo").value = teacher.resumo;
        document.getElementById("teacherHeroTitle").textContent = `${teacher.nome} acompanha interatividade, tarefas e desempenho em tempo real.`;
        document.getElementById("teacherHeroText").textContent = teacher.resumo;
    }

    function scopeLabel(item) {
        return `${item.audienceClass || "Todas"} | Turma ${item.audienceTurma || "Todas"}`;
    }

    function renderDashboard() {
        const dashboard = window.OkwetuData.getTeacherDashboard(usuario.email, { selectedClass, selectedTurma });
        if (!dashboard) return;

        const { teacher, students, submissions, totalViews, lessons, assignments } = dashboard;
        document.getElementById("totalAulas").textContent = lessons.length;
        document.getElementById("totalPdfs").textContent = assignments.length;
        document.getElementById("totalVideos").textContent = totalViews;

        syncProfileVisuals(dashboard);

        profileTarget.innerHTML = `
            <article class="profile-card stat-profile-card">
                <span class="eyebrow">Disciplina</span>
                <h3>${teacher.disciplina}</h3>
                <p>${teacher.resumo}</p>
                <p class="inline-note">Filtro atual: ${selectedClass} | Turma ${selectedTurma}</p>
            </article>
            <article class="profile-card stat-profile-card">
                <span class="eyebrow">Organizacao</span>
                <h3>${students.length} aluno(s)</h3>
                <p>Agora o painel mostra apenas a classe e a turma escolhidas, sem misturar todos os alunos.</p>
                <p class="inline-note">Aulas: ${lessons.length} | Tarefas: ${assignments.length}</p>
            </article>
            <article class="profile-card stat-profile-card">
                <span class="eyebrow">Interatividade</span>
                <h3>${submissions.length} entrega(s)</h3>
                <p>Interatividade acompanhada aula a aula com foco em desempenho e entrega.</p>
                <p class="inline-note">Visualizacoes totais: ${totalViews}</p>
            </article>
        `;

        chartTarget.innerHTML = students.length
            ? students
                  .map((student) => {
                      const progress = Math.round((student.participation + student.entregaRate + ((student.latestScore || 0) / 20) * 100) / 3);
                      return `
                        <div class="progress-row teacher-bar">
                            <div class="row-title">
                                <span>${student.nome}</span>
                                <strong>${progress}%</strong>
                            </div>
                            <div class="progress-track"><span style="width:${progress}%"></span></div>
                            <small>${student.classe} | Turma ${student.turma} | Aulas: ${student.participation}% | Tarefas: ${student.entregaRate}%</small>
                        </div>
                    `;
                  })
                  .join("")
            : `<div class="empty-state">Escolhe uma classe e uma turma com alunos ou publica conteudos para este grupo.</div>`;

        interactionsTarget.innerHTML = students.length
            ? students
                  .map((student) => `
                    <article class="interaction-card student-activity-card">
                        <div class="teacher-chip">
                            <img src="${student.avatar}" alt="${student.nome}">
                            <div>
                                <strong>${student.nome}</strong>
                                <span>${student.classe} | Turma ${student.turma}</span>
                            </div>
                        </div>
                        <span>${student.viewedLessons}/${student.totalLessons} aulas vistas</span>
                        <span>${student.submittedCount}/${student.totalAssignments} tarefas enviadas</span>
                        <span>Ultima nota: ${student.latestScore ?? "Sem nota"}</span>
                    </article>
                `)
                  .join("")
            : `<div class="empty-state">Nenhum aluno nesta combinacao de classe e turma.</div>`;

        lessonsTarget.innerHTML = lessons.length
            ? lessons
                  .map((lesson) => `
                    <article class="lesson-card enhanced-lesson-card interactive-card">
                        <div class="lesson-card-header">
                            <div>
                                <h3>${lesson.title}</h3>
                                <p>${lesson.summary}</p>
                            </div>
                            <span class="lesson-date">${lesson.date}</span>
                        </div>
                        <div class="resource-summary">
                            <span class="resource-tag">${lesson.resources.length} material(is)</span>
                            <span class="resource-tag">${lesson.watchedBy.length} aluno(s) viram</span>
                            <span class="resource-tag">${scopeLabel(lesson)}</span>
                        </div>
                        <p class="inline-note">Video: ${lesson.video || "Sem video"}</p>
                    </article>
                `)
                  .join("")
            : `<div class="empty-state">Ainda nao existem aulas para a classe e turma selecionadas.</div>`;

        submissionsTarget.innerHTML = assignments.length
            ? assignments
                  .map((assignment) => `
                    <article class="lesson-card task-receipt-card interactive-card">
                        <div class="lesson-card-header">
                            <div>
                                <h3>${assignment.title}</h3>
                                <p>${assignment.description}</p>
                            </div>
                            <span class="lesson-date">${assignment.deadline}</span>
                        </div>
                        <div class="resource-summary">
                            <span class="resource-tag">${scopeLabel(assignment)}</span>
                            <span class="resource-tag">${assignment.submissions.length} entrega(s)</span>
                        </div>
                        <div class="submission-stack">
                            ${assignment.submissions.length
                                ? assignment.submissions
                                      .map((submission) => {
                                          const student = dashboard.students.find((item) => item.email === submission.studentEmail);
                                          return `
                                            <div class="submission-pill">
                                                <div class="teacher-chip">
                                                    <img src="${student?.avatar || ""}" alt="${submission.studentEmail}">
                                                    <div>
                                                        <strong>${student?.nome || submission.studentEmail}</strong>
                                                        <span>${submission.submittedAt} | ${submission.status}</span>
                                                    </div>
                                                </div>
                                                <p>${submission.content}</p>
                                            </div>
                                        `;
                                      })
                                      .join("")
                                : '<p class="inline-note">Nenhum trabalho recebido ainda nesta turma.</p>'}
                        </div>
                    </article>
                `)
                  .join("")
            : `<div class="empty-state">Ainda nao existem tarefas para a classe e turma selecionadas.</div>`;
    }

    filterTeacherClass.addEventListener("change", () => {
        selectedClass = filterTeacherClass.value;
        renderDashboard();
    });

    filterTeacherTurma.addEventListener("change", () => {
        selectedTurma = filterTeacherTurma.value;
        renderDashboard();
    });

    document.getElementById("formNovaAula").addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("topicoAula").value.trim();
        const date = document.getElementById("dataAula").value;
        const summary = document.getElementById("descricaoAula").value.trim();
        const resources = document.getElementById("pdfsAula").value.split(",").map((item) => item.trim()).filter(Boolean);
        const video = document.getElementById("videoAula").value.trim();
        const audienceClass = aulaClasse.value;
        const audienceTurma = aulaTurma.value;

        if (!title || !date || !summary) {
            statusProfessor("Preenche topico, data e resumo para guardar a aula.", "error");
            return;
        }

        window.OkwetuData.addLesson(usuario.email, { title, date, summary, resources, video, audienceClass, audienceTurma });
        const latestLesson = window.OkwetuData.getTeacherDashboard(usuario.email)?.teacher.lessons[0];
        if (latestLesson) {
            window.OshetuDatabaseService?.upsertLesson?.(usuario.email, latestLesson);
            window.OshetuDatabaseService?.trackAnalytics?.("lesson.created", {
                teacherEmail: usuario.email,
                lessonId: latestLesson.id,
            });
        }
        event.target.reset();
        initAudienceSelectors();
        statusProfessor(`Aula publicada para ${audienceClass} - Turma ${audienceTurma}.`, "success");
        renderDashboard();
    });

    document.getElementById("formNovaTarefa").addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("tituloTarefa").value.trim();
        const deadline = document.getElementById("prazoTarefa").value;
        const description = document.getElementById("descricaoTarefa").value.trim();
        const audienceClass = tarefaClasse.value;
        const audienceTurma = tarefaTurma.value;

        if (!title || !deadline || !description) {
            statusProfessor("Preenche todos os campos da tarefa.", "error");
            return;
        }

        window.OkwetuData.addAssignment(usuario.email, { title, deadline, description, audienceClass, audienceTurma });
        const latestAssignment = window.OkwetuData.getTeacherDashboard(usuario.email)?.teacher.assignments[0];
        if (latestAssignment) {
            window.OshetuDatabaseService?.upsertAssignment?.(usuario.email, latestAssignment);
            window.OshetuDatabaseService?.trackAnalytics?.("assignment.created", {
                teacherEmail: usuario.email,
                assignmentId: latestAssignment.id,
            });
        }
        event.target.reset();
        initAudienceSelectors();
        statusProfessor(`Tarefa publicada para ${audienceClass} - Turma ${audienceTurma}.`, "success");
        renderDashboard();
    });

    document.getElementById("teacherProfileForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const file = document.getElementById("teacherAvatarInput").files[0];
        const payload = {
            disciplina: document.getElementById("teacherDiscipline").value.trim(),
            resumo: document.getElementById("teacherResumo").value.trim(),
        };
        if (file) {
            const upload = await window.OshetuDatabaseService?.uploadProfileAvatar?.(usuario.id, file);
            payload.avatar = upload?.ok ? upload.url : await fileToDataUrl(file);
        }
        window.OkwetuData.updateTeacherProfile(usuario.email, payload);
        window.OshetuDatabaseService?.update?.("teachers", usuario.id, {
            disciplina: payload.disciplina,
            resumo: payload.resumo,
        });
        if (payload.avatar) window.OshetuDatabaseService?.update?.("users", usuario.id, { avatar: payload.avatar });
        document.getElementById("teacherAvatarInput").value = "";
        initAudienceSelectors();
        statusProfessor("Perfil do professor atualizado com sucesso.", "success");
        renderDashboard();
    });

    initAudienceSelectors();
    statusProfessor("Agora podes escolher a classe e a turma que queres acompanhar no painel.", "success");
    renderDashboard();
});
