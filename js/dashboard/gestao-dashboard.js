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

document.addEventListener("DOMContentLoaded", () => {
    const usuario = window.OkwetuData.requireRole("gestao");
    if (!usuario) return;

    setupManagementTabs();

    function render() {
        const dashboard = window.OkwetuData.getManagementDashboard();
        const user = window.OkwetuData.getUserByEmail(usuario.email);

        document.getElementById("welcome").textContent = `Painel central de ${user.nome}`;
        document.getElementById("managementAvatar").src = user.avatar;
        document.getElementById("managementAvatarProfile").src = user.avatar;
        document.getElementById("managementProfileName").textContent = user.nome;
        document.getElementById("managementProfileRole").textContent = "Gestao escolar";
        document.getElementById("managementName").value = user.nome;

        document.getElementById("totalAlunos").textContent = dashboard.totalStudents;
        document.getElementById("totalProfessores").textContent = dashboard.totalTeachers;
        document.getElementById("totalClasses").textContent = dashboard.totalClasses;
        document.getElementById("totalTurmas").textContent = dashboard.totalTurmas;

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

    document.getElementById("managementProfileForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const file = document.getElementById("managementAvatarInput").files[0];
        const payload = {
            nome: document.getElementById("managementName").value.trim(),
        };
        if (file) {
            payload.avatar = await fileToDataUrl(file);
        }
        window.OkwetuData.updateManagementProfile(usuario.email, payload);
        document.getElementById("managementAvatarInput").value = "";
        render();
    });

    render();
});
