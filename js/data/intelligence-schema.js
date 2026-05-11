(function () {
    window.OshetuIntelligenceSchema = {
        users: ["id", "nome", "email", "role", "avatar", "createdAt", "updatedAt"],
        students: ["perfil", "classe", "turma", "progresso", "media", "aulasAssistidas", "tarefas", "badges", "metas"],
        teachers: ["disciplina", "classes", "turmas", "aulas", "tarefas", "analytics"],
        management: ["visaoGeral", "metricas", "analytics", "alertas", "insightsFuturosIA"],
        aiCollections: ["aiInsights", "recommendations", "performanceAnalysis"],
        events: ["lesson.viewed", "assignment.submitted", "lesson.created", "assignment.created", "dashboard.viewed"],
    };
})();
