(function () {
    const CONFIG_KEY = "oshetu-gemini-config";
    const promptLibrary = {
        aluno: ["dificuldades", "progresso", "metas", "recomendacoes"],
        professor: ["risco", "reforco", "planeamento", "feedback"],
        gestao: ["alertas", "analytics", "previsoes", "decisoes", "curriculo", "escolas"],
    };

    function readConfig() {
        try {
            return JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
        } catch (error) {
            return {};
        }
    }

    function configureGemini(config = {}) {
        const current = readConfig();
        const next = {
            apiKey: config.apiKey ?? current.apiKey ?? "",
            model: config.model || current.model || "gemini-1.5-flash",
            enabled: config.enabled ?? current.enabled ?? Boolean(config.apiKey || current.apiKey),
        };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
        return { ...next, apiKey: next.apiKey ? "configured" : "" };
    }

    function context(profile, data = {}) {
        return {
            profile,
            provider: "gemini",
            mockMode: !readConfig().enabled,
            prompts: promptLibrary[profile] || [],
            data,
        };
    }

    function mock(payload) {
        return Promise.resolve({ ...payload, status: "mock", generatedAt: new Date().toISOString() });
    }

    async function callGemini(systemInstruction, data = {}) {
        const config = readConfig();
        if (!config.enabled || !config.apiKey) {
            return null;
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || "gemini-1.5-flash"}:generateContent?key=${encodeURIComponent(config.apiKey)}`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${systemInstruction}\n\nDados OSHETU:\n${JSON.stringify(data, null, 2)}`,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.35,
                    maxOutputTokens: 900,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini respondeu com estado ${response.status}`);
        }

        const body = await response.json();
        const text = body.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n") || "";
        return {
            status: "gemini",
            provider: "gemini",
            model: config.model || "gemini-1.5-flash",
            generatedAt: new Date().toISOString(),
            text,
        };
    }

    async function withGeminiFallback(systemInstruction, data, fallbackPayload) {
        try {
            const gemini = await callGemini(systemInstruction, data);
            if (gemini) return { ...fallbackPayload, ...gemini };
        } catch (error) {
            console.warn("[OshetuAI] Gemini indisponivel, usando fallback local.", error);
        }
        return mock(fallbackPayload);
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
        return withGeminiFallback(
            "Age como analista pedagogico do Gabinete Provincial da Educacao. Resume riscos por escola, atrasos curriculares e medidas praticas. Nao exponhas mensagens privadas.",
            dashboard,
            {
            context: context("gestao", dashboard),
            title: "Alerta Executivo",
            summary: "A estrutura ja esta preparada para previsoes e insights institucionais.",
            actions: ["Monitorar turmas", "Comparar progresso", "Gerar alertas inteligentes"],
            }
        );
    }

    function generateRecommendations(profile, data = {}) {
        return mock({ context: context(profile, data), items: ["Reforco guiado", "Exercicios adaptativos", "Revisao curta"] });
    }

    function generatePerformanceAnalysis(profile, data = {}) {
        return mock({ context: context(profile, data), trend: "estavel", riskLevel: "moderado" });
    }

    function generateProvincialReport(dashboard = {}) {
        const weakSchools = (dashboard.schools || []).filter((school) => school.riskLevel === "alto");
        return withGeminiFallback(
            "Gera um relatorio executivo para o Gabinete Provincial da Educacao com leitura de desempenho, cobertura curricular, escolas em risco e intervencoes recomendadas.",
            dashboard,
            {
                context: context("gestao", dashboard),
                title: "Relatorio provincial inteligente",
                summary: weakSchools.length
                    ? `${weakSchools.length} escola(s) precisam de acompanhamento pedagogico imediato.`
                    : "Os indicadores provinciais estao sob controlo, com monitoramento continuo recomendado.",
                actions: [
                    "Comparar topicos curriculares previstos com aulas registadas",
                    "Emitir testes curtos por disciplina",
                    "Priorizar reforco nas escolas abaixo da meta",
                ],
            }
        );
    }

    function generateQuizFromCurriculum(curriculumItem = {}) {
        return withGeminiFallback(
            "Cria 3 perguntas objetivas de multipla escolha para avaliacao rapida. Responde em JSON com text, options e correctIndex.",
            curriculumItem,
            {
                context: context("gestao", curriculumItem),
                title: `Quiz rapido: ${curriculumItem.topico || "topico curricular"}`,
                questions: [
                    {
                        text: `Pergunta diagnostica sobre ${curriculumItem.topico || "o conteudo selecionado"}.`,
                        options: ["Opcao A", "Opcao B", "Opcao C", "Opcao D"],
                        correctIndex: 0,
                    },
                ],
            }
        );
    }

    window.OshetuAIService = {
        promptLibrary,
        configureGemini,
        readConfig,
        generateStudentInsight,
        generateTeacherInsight,
        generateManagementInsight,
        generateRecommendations,
        generatePerformanceAnalysis,
        generateProvincialReport,
        generateQuizFromCurriculum,
    };
})();
