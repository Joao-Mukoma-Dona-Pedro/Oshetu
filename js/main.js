document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("home-page")) {
        return;
    }

    const personaContent = {
        aluno: {
            label: "Aluno",
            title: "Uma jornada com classe, turma, tarefas e estatisticas no mesmo lugar.",
            text: "O estudante entra pelo proprio perfil, e a plataforma organiza acesso a aulas, tarefas e desempenho individual sem informacoes espalhadas.",
            points: [
                "Encaminhamento automatico para classe e turma conforme o perfil.",
                "Marcacao de aulas vistas e envio de tarefas aos professores.",
                "Leitura visual do proprio progresso, media e participacao."
            ]
        },
        professor: {
            label: "Professor",
            title: "Mais controle para publicar aulas, receber trabalhos e acompanhar a turma.",
            text: "O professor publica conteudos, recebe tarefas feitas pelos alunos e identifica rapidamente quem assistiu as aulas e quem precisa de mais apoio.",
            points: [
                "Criacao de aulas com materiais, resumo e video.",
                "Recebimento de trabalhos enviados pelos alunos no proprio painel.",
                "Grafico de desempenho e interatividade por aluno."
            ]
        },
        gestao: {
            label: "Gestao",
            title: "Uma visao completa da escola, inclusive por turma e por classe.",
            text: "A gestao acompanha o progresso geral, a distribuicao de alunos e o desempenho medio de todas as turmas para agir com mais clareza.",
            points: [
                "Leitura consolidada do desempenho de todos os alunos.",
                "Grafico com medias por turma e por classe.",
                "Monitoramento da atividade de professores, aulas e tarefas."
            ]
        }
    };

    const homeCover = document.getElementById("homeCover");
    const coverDots = Array.from(document.querySelectorAll(".hero-cover-dots span"));
    const coverImages = [
        "../assets/imagens/IMG-20251023-WA0033.jpg",
        "../assets/imagens/IMG-20251023-WA0013.jpg",
        "../assets/imagens/IMG-20251023-WA0047.jpg"
    ];
    let activeCover = 0;

    function setCover(index) {
        if (!homeCover || !coverImages[index]) {
            return;
        }

        activeCover = index;
        homeCover.style.setProperty("--home-cover", `url("${coverImages[index]}")`);
        coverDots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    }

    setCover(activeCover);
    if (homeCover && coverImages.length > 1) {
        window.setInterval(() => {
            setCover((activeCover + 1) % coverImages.length);
        }, 5200);
    }

    const tabs = Array.from(document.querySelectorAll(".persona-tab"));
    const personaLabel = document.getElementById("personaLabel");
    const personaTitle = document.getElementById("personaTitle");
    const personaText = document.getElementById("personaText");
    const personaPoints = document.getElementById("personaPoints");

    function setPersona(key) {
        const content = personaContent[key];
        if (!content) {
            return;
        }

        tabs.forEach((tab) => {
            const isActive = tab.dataset.persona === key;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-pressed", String(isActive));
        });

        personaLabel.textContent = content.label;
        personaTitle.textContent = content.title;
        personaText.textContent = content.text;
        personaPoints.innerHTML = content.points.map((point) => `<li>${point}</li>`).join("");
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => setPersona(tab.dataset.persona));
    });

    setPersona("aluno");

    const faqButtons = document.querySelectorAll(".faq-toggle");
    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const expanded = button.getAttribute("aria-expanded") === "true";
            const content = button.nextElementSibling;

            faqButtons.forEach((otherButton) => {
                otherButton.setAttribute("aria-expanded", "false");
                const otherContent = otherButton.nextElementSibling;
                if (otherContent) {
                    otherContent.style.maxHeight = "0px";
                }
            });

            if (!expanded && content) {
                button.setAttribute("aria-expanded", "true");
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    const revealElements = document.querySelectorAll(".section-reveal");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => revealObserver.observe(element));

    const counters = document.querySelectorAll(".count-up");
    counters.forEach((counter) => {
        const target = Number(counter.dataset.target || 0);
        const suffix = counter.dataset.suffix || "";
        let current = 0;
        const duration = 700;
        const stepTime = target > 0 ? Math.max(20, Math.floor(duration / target)) : duration;

        const timer = window.setInterval(() => {
            current += 1;
            counter.textContent = `${current}${suffix}`;
            if (current >= target) {
                window.clearInterval(timer);
            }
        }, stepTime);
    });
});
