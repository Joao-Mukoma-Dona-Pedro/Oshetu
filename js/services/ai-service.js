(function () {
    const promptLibrary = {
        aluno: ["dificuldades", "progresso", "metas", "recomendacoes"],
        professor: ["risco", "reforco", "planeamento", "feedback"],
        gestao: ["alertas", "analytics", "previsoes", "decisoes"],
    };

    function context(profile, data = {}) {
        return {
            profile,
            provider: "gemini-api-future",
            mockMode: true,
            prompts: promptLibrary[profile] || [],
            data,
        };
    }

    function mock(payload) {
        return Promise.resolve({ ...payload, status: "mock", generatedAt: new Date().toISOString() });
    }

    function generateStudentInsight(profile = {}) {
        return mock({
            context: context("aluno", profile),
            title: "Insight Inteligente",
            summary: "A IA detectou uma oportunidade de reforcar o estudo semanal.",
            actions: ["Rever a aula mais recente", "Completar uma tarefa pendente", "Manter uma meta de 75%"],
        });
    }

    function generateTeacherInsight(dashboard = {}) {
        return mock({
            context: context("professor", dashboard),
            title: "Sugestao da IA",
            summary: "Alguns alunos podem precisar de reforco guiado nesta semana.",
            actions: ["Priorizar tarefas pendentes", "Criar revisao curta", "Agrupar alunos por dificuldade"],
        });
    }

    function generateManagementInsight(dashboard = {}) {
        return mock({
            context: context("gestao", dashboard),
            title: "Alerta Executivo",
            summary: "A estrutura ja esta preparada para previsoes e insights institucionais.",
            actions: ["Monitorar turmas", "Comparar progresso", "Gerar alertas inteligentes"],
        });
    }

    function generateRecommendations(profile, data = {}) {
        return mock({ context: context(profile, data), items: ["Reforco guiado", "Exercicios adaptativos", "Revisao curta"] });
    }

    function generatePerformanceAnalysis(profile, data = {}) {
        return mock({ context: context(profile, data), trend: "estavel", riskLevel: "moderado" });
    }

    window.OshetuAIService = {
        promptLibrary,
        generateStudentInsight,
        generateTeacherInsight,
        generateManagementInsight,
        generateRecommendations,
        generatePerformanceAnalysis,
    };
})();
