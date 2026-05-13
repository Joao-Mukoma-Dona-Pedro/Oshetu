const FLASH_KEY = "oshetu_flash_message";

function showStatus(element, text, type = "info") {
    if (!element) {
        return;
    }

    element.textContent = text;
    element.className = `status-message is-visible is-${type}`;
}

function clearStatus(element) {
    if (!element) {
        return;
    }

    element.textContent = "";
    element.className = "status-message";
}

function setFlashMessage(text, type = "info") {
    sessionStorage.setItem(FLASH_KEY, JSON.stringify({ text, type }));
}

function consumeFlashMessage(element) {
    const raw = sessionStorage.getItem(FLASH_KEY);
    if (!raw) {
        return;
    }

    sessionStorage.removeItem(FLASH_KEY);

    try {
        const message = JSON.parse(raw);
        showStatus(element, message.text, message.type);
    } catch (error) {
        showStatus(element, raw, "info");
    }
}

function normaliseEmail(value) {
    return value.trim().toLowerCase();
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function activateRole(role) {
    const roleInput = document.getElementById("tipoUsuario");
    const options = document.querySelectorAll(".role-option");

    if (!roleInput || options.length === 0) {
        return;
    }

    roleInput.value = role;
    options.forEach((option) => {
        const isActive = option.dataset.role === role;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
    });

    const studentField = document.getElementById("studentProfileField");
    const teacherField = document.getElementById("teacherDisciplineField");

    if (studentField) {
        studentField.hidden = role !== "aluno";
    }

    if (teacherField) {
        teacherField.hidden = role !== "professor";
    }
}

function updatePasswordStrength(input) {
    const bar = document.getElementById("passwordStrengthBar");
    const text = document.getElementById("passwordStrengthText");
    if (!bar || !text || !input) {
        return;
    }

    const value = input.value;
    let strength = 0;

    if (value.length >= 6) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;

    const levels = [
        { width: "0%", color: "#d4861a", label: "Usa pelo menos 6 caracteres." },
        { width: "35%", color: "#d4861a", label: "Senha basica. Podes reforcar mais." },
        { width: "60%", color: "#cc9c2d", label: "Senha aceitavel. Adiciona mais variedade se quiseres." },
        { width: "80%", color: "#2d8abb", label: "Senha forte." },
        { width: "100%", color: "#1f8f5f", label: "Senha muito forte." },
    ];

    const current = levels[strength];
    bar.style.width = current.width;
    bar.style.backgroundColor = current.color;
    text.textContent = current.label;
}

function setupPasswordToggles() {
    document.querySelectorAll(".toggle-password").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.target);
            if (!input) {
                return;
            }

            const showing = input.type === "text";
            input.type = showing ? "password" : "text";
            button.textContent = showing ? "Mostrar" : "Ocultar";
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupPasswordToggles();

    const statusElement = document.getElementById("authMessage");
    consumeFlashMessage(statusElement);

    const passwordInput = document.getElementById("cadastroSenha");
    if (passwordInput) {
        passwordInput.addEventListener("input", () => updatePasswordStrength(passwordInput));
        updatePasswordStrength(passwordInput);
    }

    document.querySelectorAll(".role-option").forEach((option) => {
        option.addEventListener("click", () => activateRole(option.dataset.role));
    });

    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) {
        activateRole("aluno");

        formCadastro.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearStatus(statusElement);

            const nome = document.getElementById("cadastroNome").value.trim();
            const email = normaliseEmail(document.getElementById("cadastroEmail").value);
            const senha = document.getElementById("cadastroSenha").value;
            const tipo = document.getElementById("tipoUsuario").value;
            const perfil = document.getElementById("perfilAluno")?.value || "";
            const disciplina = document.getElementById("disciplinaProfessor")?.value.trim() || "";

            if (!nome || !email || !senha || !tipo) {
                showStatus(statusElement, "Preenche todos os campos antes de continuar.", "error");
                return;
            }

            if (!emailIsValid(email)) {
                showStatus(statusElement, "Introduce um email valido para criar a conta.", "error");
                return;
            }

            if (senha.length < 6) {
                showStatus(statusElement, "A senha precisa de pelo menos 6 caracteres.", "error");
                return;
            }

            if (tipo === "aluno" && !perfil) {
                showStatus(statusElement, "Seleciona o perfil do aluno para o encaminhamento automatico.", "error");
                return;
            }

            const result = await window.OshetuAuthService.register({ nome, email, senha, tipo, perfil, disciplina });
            if (!result.ok) {
                showStatus(statusElement, result.message, "error");
                return;
            }

            setFlashMessage("Conta criada com sucesso. Bem-vindo ao Oshetu.", "success");
            window.location.href = window.OshetuAuthService.routeForRole(result.user.tipo || result.user.role);
        });
    }

    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        const rememberedEmail = localStorage.getItem("oshetu_last_email");
        const loginEmail = document.getElementById("loginEmail");
        if (rememberedEmail && loginEmail) {
            loginEmail.value = rememberedEmail;
        }

        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearStatus(statusElement);

            const email = normaliseEmail(document.getElementById("loginEmail").value);
            const senha = document.getElementById("loginSenha").value;

            if (!emailIsValid(email) || !senha) {
                showStatus(statusElement, "Preenche email institucional e senha corretamente para entrar.", "error");
                return;
            }

            const result = await window.OshetuAuthService.login(email, senha);
            if (!result.ok) {
                showStatus(statusElement, result.message, "error");
                return;
            }

            setFlashMessage("Entrada confirmada. Sessao iniciada com sucesso.", "success");
            window.location.href = window.OshetuAuthService.routeForRole(result.user.tipo || result.user.role);
        });
    }
});

async function logout() {
    await window.OshetuAuthService.logout();
    setFlashMessage("Sessao terminada com sucesso.", "info");
    window.location.href = "login.html";
}
