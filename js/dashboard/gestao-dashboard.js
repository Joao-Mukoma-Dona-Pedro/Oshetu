function setupManagementTabs() {
    const buttons = Array.from(document.querySelectorAll("#managementTabs .tab-button"));
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

function parseAssessmentQuestions(rawText) {
    return rawText
        .split("\n")
        .map((line, index) => {
            const [text, optionText = "Opcao correta;Opcao B;Opcao C;Opcao D"] = line.split("|").map((item) => item.trim());
            if (!text) return null;
            const options = optionText.split(";").map((item) => item.trim()).filter(Boolean);
            return {
                id: `q${index + 1}`,
                text,
                options: options.length >= 2 ? options : ["Verdadeiro", "Falso"],
                correctIndex: 0,
            };
        })
        .filter(Boolean);
}

document.addEventListener("DOMContentLoaded", async () => {
    await window.OshetuAuthService?.ready?.();
    await window.OshetuDatabaseService?.hydrateLocalCache?.();

    const usuario = window.OshetuAuthService?.requireRole?.("gestao") || window.OkwetuData.requireRole("gestao");
    if (!usuario) return;

    setupManagementTabs();

    function render() {
        const dashboard = window.OkwetuData.getProvincialDashboard();
        const user = window.OkwetuData.getUserByEmail(usuario.email);
        window.OshetuDatabaseService?.trackAnalytics?.("dashboard.viewed", {
            role: "gestao",
            totalStudents: dashboard.totalStudents,
            totalTeachers: dashboard.totalTeachers,
        });

        document.getElementById("welcome").textContent = `${dashboard.province.name} | ${user.nome}`;
        document.getElementById("managementAvatar").src = user.avatar;
        document.getElementById("managementAvatarProfile").src = user.avatar;
        document.getElementById("managementProfileName").textContent = user.nome;
        document.getElementById("managementProfileRole").textContent = "Gestao escolar";
        document.getElementById("managementName").value = user.nome;

        document.getElementById("totalAlunos").textContent = dashboard.totalStudents;
        document.getElementById("totalProfessores").textContent = dashboard.totalTeachers;
        document.getElementById("totalClasses").textContent = dashboard.totalClasses;
        document.getElementById("totalTurmas").textContent = dashboard.totalTurmas;

        document.getElementById("schoolRegistry").innerHTML = dashboard.schools
            .map((school) => `
                <article class="profile-card stat-profile-card interactive-card">
                    <div>
                        <span class="eyebrow">${school.municipio} | ${school.codigoEscolar}</span>
                        <h3>${school.nome}</h3>
                    </div>
                    <p>${school.endereco}</p>
                    <p class="inline-note">${school.nivelEnsino} | Contactos: ${school.contatos}</p>
                    <div class="resource-summary">
                        <span class="resource-tag">${school.totalStudents} aluno(s)</span>
                        <span class="resource-tag">${school.totalTeachers} professor(es)</span>
                        <span class="resource-tag">Progresso ${school.averageProgress}%</span>
                        <span class="resource-tag">Testes ${school.assessmentAverage}%</span>
                    </div>
                </article>
            `)
            .join("");

        document.getElementById("curriculumCoverage").innerHTML = dashboard.curriculumCoverage
            .map((item) => `
                <article class="profile-card stat-profile-card ${item.status === "atencao" ? "risk-card" : ""}">
                    <span class="eyebrow">${item.periodo}</span>
                    <h3>${item.disciplina} | ${item.classe}</h3>
                    <p>${item.topico}</p>
                    <div class="resource-summary">
                        <span class="resource-tag">Aulas registadas: ${item.lessonsLogged}</span>
                        <span class="resource-tag">Dominio: ${item.mastery}%</span>
                        <span class="resource-tag">Meta: ${item.masteryTarget}%</span>
                        <span class="resource-tag">${item.status}</span>
                    </div>
                </article>
            `)
            .join("");

        document.getElementById("assessmentRegistry").innerHTML = dashboard.provincialAssessments
            .map((assessment) => {
                const avg = assessment.responses.length
                    ? Math.round(assessment.responses.reduce((sum, response) => sum + response.score, 0) / assessment.responses.length)
                    : 0;
                return `
                    <article class="lesson-card enhanced-lesson-card interactive-card">
                        <div class="lesson-card-header">
                            <div>
                                <span class="eyebrow">${assessment.disciplina} | ${assessment.classe}</span>
                                <h3>${assessment.title}</h3>
                                <p>${assessment.topic}</p>
                            </div>
                            <span class="lesson-date">${assessment.scheduledFor}</span>
                        </div>
                        <div class="resource-summary">
                            <span class="resource-tag">${assessment.status}</span>
                            <span class="resource-tag">${assessment.questions.length} pergunta(s)</span>
                            <span class="resource-tag">${assessment.responses.length} resposta(s)</span>
                            <span class="resource-tag">Media ${avg}%</span>
                        </div>
                    </article>
                `;
            })
            .join("");

        const alertsTarget = document.querySelector(".management-alerts");
        alertsTarget.innerHTML = dashboard.alerts.length
            ? dashboard.alerts.map((alert) => `
                <div class="alert-card ${alert.type === "school-risk" ? "danger" : "warning"}">
                    <span>!</span>
                    <div>
                        <strong>${alert.title}</strong>
                        <p>${alert.message}</p>
                    </div>
                </div>
            `).join("")
            : `
                <div class="alert-card success">
                    <span>OK</span>
                    <div>
                        <strong>Rede provincial sob controlo</strong>
                        <p>Nenhum alerta critico gerado pelos indicadores atuais.</p>
                    </div>
                </div>
            `;

        document.getElementById("graficoTurmas").innerHTML = dashboard.turmaPerformance
            .map((turma) => `
                <div class="progress-row teacher-bar">
                    <div class="row-title">
                        <span>${turma.label} (${turma.total} alunos)</span>
                        <strong>${turma.mediaProgresso}%</strong>
                    </div>
                    <div class="progress-track"><span style="width:${turma.mediaProgresso}%"></span></div>
                    <small>Media de notas: ${turma.mediaNotas}/20</small>
                </div>
            `)
            .join("");

        document.getElementById("topAlunosGrafico").innerHTML = dashboard.topStudents
            .map((student) => `
                <div class="progress-row teacher-bar">
                    <div class="row-title user-row">
                        <div class="teacher-chip">
                            <img src="${student.avatar}" alt="${student.nome}">
                            <span>${student.nome}</span>
                        </div>
                        <strong>${student.progresso}%</strong>
                    </div>
                    <div class="progress-track"><span style="width:${student.progresso}%"></span></div>
                    <small>${student.classe} | Turma ${student.turma} | Media ${student.media}/20</small>
                </div>
            `)
            .join("");

        document.getElementById("graficoClasses").innerHTML = `
            <div class="analytics-card-header">
                <span class="eyebrow">Classes</span>
                <h3>Progresso medio por classe</h3>
            </div>
            ${dashboard.classePerformance.map((classe) => `
                <div class="progress-row teacher-bar">
                    <div class="row-title">
                        <span>${classe.label}</span>
                        <strong>${classe.mediaProgresso}%</strong>
                    </div>
                    <div class="progress-track"><span style="width:${classe.mediaProgresso}%"></span></div>
                    <small>${classe.total} aluno(s)</small>
                </div>
            `).join("")}
        `;

        document.getElementById("graficoPerfis").innerHTML = `
            <div class="analytics-card-header">
                <span class="eyebrow">Perfis</span>
                <h3>Distribuicao de alunos por perfil</h3>
            </div>
            ${dashboard.profileDistribution.map((perfil) => `
                <div class="progress-row teacher-bar">
                    <div class="row-title">
                        <span>${perfil.label}</span>
                        <strong>${perfil.percent}%</strong>
                    </div>
                    <div class="progress-track"><span style="width:${perfil.percent}%"></span></div>
                    <small>${perfil.total} aluno(s)</small>
                </div>
            `).join("")}
        `;

        document.getElementById("listaAlunosGestao").innerHTML = dashboard.studentPerformance
            .map((student) => `
                <article class="interaction-card management-row">
                    <div class="teacher-chip">
                        <img src="${student.avatar}" alt="${student.nome}">
                        <strong>${student.nome}</strong>
                    </div>
                    <span>${student.perfil}</span>
                    <span>${student.classe} | Turma ${student.turma}</span>
                    <span>${student.aulasAssistidas}/${student.totalAulas} aulas</span>
                    <span>${student.entregas}/${student.totalTarefas} tarefas</span>
                    <span>Media ${student.media}/20</span>
                    <span>${student.progresso}% progresso</span>
                </article>
            `)
            .join("");

        document.getElementById("listaProfessoresGestao").innerHTML = dashboard.teachers
            .map((teacher) => `
                <article class="profile-card stat-profile-card interactive-card">
                    <div class="teacher-chip">
                        <img src="${teacher.avatar}" alt="${teacher.nome}">
                        <div>
                            <span class="eyebrow">${teacher.disciplina}</span>
                            <h3>${teacher.nome}</h3>
                        </div>
                    </div>
                    <p>${teacher.resumo}</p>
                    <p class="inline-note">Classes: ${teacher.classes.join(", ")} | Turmas: ${teacher.turmas.join(", ")}</p>
                    <p class="inline-note">Aulas: ${teacher.lessons.length} | Trabalhos recebidos: ${teacher.assignments.reduce((sum, item) => sum + item.submissions.length, 0)}</p>
                </article>
            `)
            .join("");
    }

    document.getElementById("schoolForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const school = window.OkwetuData.addSchool({
            nome: document.getElementById("schoolName").value.trim(),
            codigoEscolar: document.getElementById("schoolCode").value.trim(),
            municipio: document.getElementById("schoolMunicipio").value.trim(),
            nivelEnsino: document.getElementById("schoolLevel").value.trim(),
            endereco: document.getElementById("schoolAddress").value.trim(),
            contatos: document.getElementById("schoolContacts").value.trim(),
            nif: document.getElementById("schoolNif").value.trim(),
        });
        window.OshetuDatabaseService?.create?.("schools", school, school.id);
        event.target.reset();
        render();
    });

    document.getElementById("assessmentForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const questions = parseAssessmentQuestions(document.getElementById("assessmentQuestions").value);
        const assessment = window.OkwetuData.createProvincialAssessment({
            title: document.getElementById("assessmentTitle").value.trim(),
            scheduledFor: document.getElementById("assessmentDate").value,
            classe: document.getElementById("assessmentClass").value.trim(),
            disciplina: document.getElementById("assessmentSubject").value.trim(),
            topic: document.getElementById("assessmentTopic").value.trim(),
            questions,
        });
        window.OshetuDatabaseService?.create?.("provincialAssessments", assessment, assessment.id);
        window.OshetuDatabaseService?.createNotification?.({
            title: "Teste provincial programado",
            message: `${document.getElementById("assessmentSubject").value} - ${document.getElementById("assessmentTopic").value}`,
            role: "todos",
            type: "assessment",
        });
        event.target.reset();
        render();
    });

    document.getElementById("geminiConfigForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const config = window.OshetuAIService.configureGemini({
            apiKey: document.getElementById("geminiApiKey").value.trim(),
            model: document.getElementById("geminiModel").value.trim() || "gemini-1.5-flash",
            enabled: true,
        });
        document.getElementById("geminiInsight").innerHTML = `<p class="inline-note">Gemini configurado com modelo ${config.model}.</p>`;
        document.getElementById("geminiApiKey").value = "";
    });

    document.getElementById("generateGeminiReport").addEventListener("click", async () => {
        const target = document.getElementById("geminiInsight");
        target.innerHTML = `<p class="inline-note">A gerar analise inteligente...</p>`;
        const report = await window.OshetuAIService.generateProvincialReport(window.OkwetuData.getProvincialDashboard());
        target.innerHTML = `
            <h4>${report.title || "Relatorio Gemini"}</h4>
            <p>${report.text || report.summary}</p>
            ${(report.actions || []).map((action) => `<span class="resource-tag">${action}</span>`).join("")}
        `;
        window.OshetuDatabaseService?.saveAIPlaceholder?.("aiInsights", report);
    });

    document.getElementById("managementProfileForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const file = document.getElementById("managementAvatarInput").files[0];
        const payload = {
            nome: document.getElementById("managementName").value.trim(),
        };
        if (file) {
            const upload = await window.OshetuDatabaseService?.uploadProfileAvatar?.(usuario.id, file);
            payload.avatar = upload?.ok ? upload.url : await fileToDataUrl(file);
        }
        window.OkwetuData.updateManagementProfile(usuario.email, payload);
        window.OshetuDatabaseService?.update?.("management", usuario.id, { nome: payload.nome });
        if (payload.avatar) window.OshetuDatabaseService?.update?.("users", usuario.id, { avatar: payload.avatar });
        document.getElementById("managementAvatarInput").value = "";
        render();
    });

    render();
});
