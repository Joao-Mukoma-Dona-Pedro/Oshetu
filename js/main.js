document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("home-page")) {
        return;
    }

    const personaContent = {
        aluno: {
            label: "Aluno",
            title: "Uma jornada mais clara para acompanhar disciplinas e materiais.",
            text: "O estudante encontra aulas, recursos e indicacoes de forma simples, sem perder tempo procurando informacoes espalhadas.",
            points: [
                "Pesquisa rapida por disciplina e professor.",
                "Aulas expandidas com materiais e recursos.",
                "Leitura visual do proprio percurso de aprendizagem."
            ]
        },
        professor: {
            label: "Professor",
            title: "Mais controle para planear aulas e atualizar recursos.",
            text: "O professor organiza o proprio perfil, adiciona conteudos e mantem uma visao pratica do que ja foi preparado para os alunos.",
            points: [
                "Cadastro de aulas com topico, data, descricao e recursos.",
                "Edicao rapida de materiais e estrutura do curso.",
                "Feedback visual do proprio volume de conteudos."
            ]
        },
        gestao: {
            label: "Gestao",
            title: "Uma visao mais limpa do que acontece na experiencia escolar.",
            text: "A gestao percebe o nivel de organizacao academica e enxerga onde a plataforma gera mais clareza operacional.",
            points: [
                "Centralizacao de fluxos em uma unica experiencia.",
                "Leitura mais facil do estado das aulas e perfis.",
                "Melhor comunicacao do valor da plataforma."
            ]
        }
    };

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
