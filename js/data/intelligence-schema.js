(function () {
    window.OshetuIntelligenceSchema = {
        users: ["id", "nome", "email", "role", "avatar", "createdAt", "updatedAt"],
        province: ["id", "name", "province", "scope"],
        schools: ["id", "nome", "endereco", "municipio", "nivelEnsino", "contatos", "nif", "codigoEscolar", "status"],
        students: ["perfil", "classe", "turma", "schoolId", "progresso", "media", "aulasAssistidas", "tarefas", "badges", "metas"],
        teachers: ["disciplina", "schoolId", "classes", "turmas", "aulas", "tarefas", "analytics"],
        curriculum: ["classe", "disciplina", "topico", "periodo", "expectedBy", "masteryTarget"],
        assessments: ["title", "classe", "disciplina", "topic", "scheduledFor", "questions", "responses"],
        management: ["visaoGeral", "metricas", "analytics", "alertas", "insightsFuturosIA", "privacidade"],
        aiCollections: ["aiInsights", "recommendations", "performanceAnalysis"],
        events: ["lesson.viewed", "assignment.submitted", "lesson.created", "assignment.created", "dashboard.viewed", "school.created", "provincial-assessment.created", "assessment.response.saved"],
    };
})();
