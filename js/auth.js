// =========================
// CADASTRO
// =========================
const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function(e) {
        e.preventDefault();

        const nome = document.querySelector("input[type='text']").value.trim();
        const email = document.querySelector("input[type='email']").value.trim();
        const senha = document.querySelector("input[type='password']").value;
        const tipo = document.getElementById("tipoUsuario").value;

        if (!nome || !email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        if(!tipo){
            alert("Selecione o tipo de usuário.");
            return;
        }

        // Recupera lista de usuários do localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verifica se já existe usuário com mesmo email
        const existe = usuarios.find(u => u.email === email);
        if(existe){
            alert("Usuário com este email já existe!");
            return;
        }

        const novoUsuario = { nome, email, senha, tipo };

        // Adiciona à lista
        usuarios.push(novoUsuario);

        // Salva a lista de usuários e o usuário logado
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("usuario", JSON.stringify(novoUsuario));

        alert("Conta criada com sucesso!");

        // Redireciona conforme tipo
        if(tipo === "aluno"){
            window.location.href = "aluno.html";
        } else {
            window.location.href = "professor.html";
        }
    });
}

// =========================
// LOGIN
// =========================
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.querySelector("input[type='email']").value.trim();
        const senha = document.querySelector("input[type='password']").value;

        // Recupera todos os usuários
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Procura usuário correspondente
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);

        if (usuario) {
            // Salva o usuário logado
            localStorage.setItem("usuario", JSON.stringify(usuario));

            alert("Login bem-sucedido!");

            // Redireciona conforme tipo
            if(usuario.tipo === "aluno"){
                window.location.href = "aluno.html";
            } else if(usuario.tipo === "professor"){
                window.location.href = "professor.html";
            }
        } else {
            alert("Email ou senha inválidos!");
        }
    });
}

// =========================
// LOGOUT (opcional)
// =========================
function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}