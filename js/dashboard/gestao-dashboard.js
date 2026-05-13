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
                skill: "Aplicacao e raciocinio",
            };
        })
        .filter(Boolean);
}

function formatGeneratedQuestions(result) {
    if (Array.isArray(result?.questions)) {
        return result.questions.map((question) => `${question.text} | ${question.options.join("; ")}`).join("\n");
    }
    const text = result?.text || "";
    return text.includes("|") ? text : "";
}

document.addEventListener("DOMContentLoaded", async () => {
    await window.OshetuAuthService?.ready?.();
    await window.OshetuDatabaseService?.hydrateLocalCache?.();

    const usuario = window.OshetuAuthService?.requireRole?.("gestao") || window.OkwetuData.requireRole("gestao");
    if (!usuario) return;

    setupManagementTabs();

    function renderAlerts(dashboard) {
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
                        <p>Nenhum alerta critico gerado pelos indicadores institucionais atuais.</p>
                    </div>
                </div>
            `;
    }

    function render() {
        const dashboard = window.OkwetuData.getProvincialDashboard();
        const user = window.OkwetuData.getUserByEmail(usuario.email);
        const municipalities = new Set(dashboard.schools.map((school) => school.municipio).filter(Boolean));

        window.OshetuDatabaseService?.trackAnalytics?.("dashboard.viewed", {
            role: "gestao",
            totalSchools: dashboard.schools.length,
            totalCurriculum: dashboard.curriculumCoverage.length,
        });

        document.getElementById("welcome").textContent = dashboard.province.name;
        document.getElementById("managementAvatar").src = user.avatar;
        document.getElementById("managementAvatarProfile").src = user.avatar;
        document.getElementById("managementProfileName").textContent = user.nome;
        document.getElementById("managementProfileRole").textContent = "Administrador provincial";
        document.getElementById("managementName").value = user.nome;

        document.getElementById("totalEscolas").textContent = dashboard.schools.length;
        document.getElementById("totalMunicipios").textContent = municipalities.size;
        document.getElementById("totalCurriculos").textContent = dashboard.curriculumCoverage.length;
        document.getElementById("totalAvaliacoes").textContent = dashboard.provincialAssessments.length;

        renderAlerts(dashboard);

        document.getElementById("schoolPerformanceChart").innerHTML = dashboard.schools.length
            ? dashboard.schools.map((school) => `
                <div class="progress-row teacher-bar">
                    <div class="row-title">
                        <span>${school.nome}</span>
                        <strong>${school.assessmentAverage || school.averageProgress}%</strong>
                    </div>
                    <div class="progress-track"><span style="width:${school.assessmentAverage || school.averageProgress}%"></span></div>
                    <small>${school.municipio} | ${school.nivelEnsino} | risco ${school.riskLevel}</small>
                </div>
            `).join("")
            : `<div class="empty-state">Nenhuma escola cadastrada pelo Gabinete.</div>`;

        document.getElementById("curriculumOverviewChart").innerHTML = dashboard.curriculumCoverage.length
            ? dashboard.curriculumCoverage.slice(0, 6).map((item) => `
                <div class="progress-row teacher-bar">
                    <div class="row-title">
                        <span>${item.disciplina} - ${item.topico}</span>
                        <strong>${item.mastery}%</strong>
                    </div>
                    <div class="progress-track"><span style="width:${item.mastery}%"></span></div>
                    <small>${item.classe} | ${item.periodo} | meta ${item.masteryTarget}% | ${item.status}</small>
                </div>
            `).join("")
            : `<div class="empty-state">Adicione conteudos curriculares para monitoramento.</div>`;

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
                        <span class="resource-tag">Progresso ${school.averageProgress}%</span>
                        <span class="resource-tag">Testes ${school.assessmentAverage}%</span>
                        <span class="resource-tag">Risco ${school.riskLevel}</span>
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
                                <span class="eyebrow">${assessment.scope === "local" ? "Avaliacao local" : "Avaliacao provincial"} | ${assessment.disciplina} | ${assessment.classe}</span>
                                <h3>${assessment.title}</h3>
                                <p>${assessment.topic}</p>
                            </div>
                            <span class="lesson-date">${assessment.scheduledFor}</span>
                        </div>
                        <p class="inline-note">${assessment.instructions}</p>
                        <div class="resource-summary">
                            <span class="resource-tag">${assessment.status}</span>
                            <span class="resource-tag">${assessment.durationMinutes} min</span>
                            <span class="resource-tag">${assessment.questions.length} pergunta(s)</span>
                            <span class="resource-tag">${assessment.responses.length} resposta(s)</span>
                            <span class="resource-tag">Media ${avg}%</span>
                        </div>
                    </article>
                `;
            })
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
            adminEmail: document.getElementById("schoolAdminEmail").value.trim().toLowerCase(),
            temporaryPassword: document.getElementById("schoolTemporaryPassword").value.trim(),
        });
        window.OshetuDatabaseService?.create?.("schools", school, school.id);
        event.target.reset();
        render();
    });

    document.getElementById("curriculumForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const item = window.OkwetuData.addCurriculumItem({
            nivelEnsino: document.getElementById("curriculumLevel").value.trim(),
            classe: document.getElementById("curriculumClass").value.trim(),
            disciplina: document.getElementById("curriculumSubject").value.trim(),
            periodo: document.getElementById("curriculumPeriod").value.trim(),
            topico: document.getElementById("curriculumTopic").value.trim(),
            expectedBy: document.getElementById("curriculumExpectedBy").value,
            masteryTarget: document.getElementById("curriculumTarget").value,
        });
        window.OshetuDatabaseService?.create?.("curriculum", item, item.id);
        event.target.reset();
        render();
    });

    document.getElementById("generateAssessmentQuestions").addEventListener("click", async () => {
        const target = document.getElementById("assessmentQuestions");
        const curriculumItem = {
            classe: document.getElementById("assessmentClass").value.trim(),
            disciplina: document.getElementById("assessmentSubject").value.trim(),
            topico: document.getElementById("assessmentTopic").value.trim(),
        };
        const result = await window.OshetuAIService.generateQuizFromCurriculum(curriculumItem);
        const generated = formatGeneratedQuestions(result);
        if (generated) target.value = generated;
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
            durationMinutes: document.getElementById("assessmentDuration").value,
            instructions: document.getElementById("assessmentInstructions").value.trim(),
            scope: "provincial",
            createdByRole: "gestao",
            questions,
        });
        window.OshetuDatabaseService?.create?.("provincialAssessments", assessment, assessment.id);
        window.OshetuDatabaseService?.createNotification?.({
            title: "Teste provincial programado",
            message: `${assessment.disciplina} - ${assessment.topic}`,
            role: "escola",
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
        const level = document.getElementById("geminiLevelFilter").value.trim().toLowerCase();
        const subject = document.getElementById("geminiSubjectFilter").value.trim().toLowerCase();
        const dashboard = window.OkwetuData.getProvincialDashboard();
        const filtered = {
            ...dashboard,
            curriculumCoverage: dashboard.curriculumCoverage.filter((item) =>
                (!level || String(item.nivelEnsino || "").toLowerCase().includes(level)) &&
                (!subject || item.disciplina.toLowerCase().includes(subject))
            ),
        };
        target.innerHTML = `<p class="inline-note">A gerar analise inteligente...</p>`;
        const report = await window.OshetuAIService.generateProvincialReport(filtered);
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
