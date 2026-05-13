(function () {
    const ROLE_ROUTES = {
        aluno: "aluno.html",
        professor: "professor.html",
        escola: "escola.html",
        gestao: "gestao.html",
    };

    let sessionReadyPromise = null;

    function normalizeRole(role) {
        return ["aluno", "professor", "escola", "gestao"].includes(role) ? role : "aluno";
    }

    function normalizeEmail(email = "") {
        return String(email).trim().toLowerCase();
    }

    function publicUser(firebaseUser, profile = {}) {
        const role = normalizeRole(profile.role || profile.tipo);
        return {
            id: profile.id || firebaseUser?.uid || profile.email,
            nome: profile.nome || firebaseUser?.displayName || "Utilizador Oshetu",
            email: profile.email || firebaseUser?.email || "",
            role,
            tipo: role,
            avatar: profile.avatar || firebaseUser?.photoURL || "",
            createdAt: profile.createdAt || null,
            updatedAt: profile.updatedAt || null,
            provider: firebaseUser ? "firebase" : "local",
        };
    }

    function saveLocalSession(user) {
        if (!user) {
            localStorage.removeItem("usuario");
            return null;
        }
        localStorage.setItem("usuario", JSON.stringify(user));
        if (user.email) localStorage.setItem("oshetu_last_email", user.email);
        return user;
    }

    async function getFirebaseProfile(uid) {
        return window.OshetuDatabaseService.get("users", uid);
    }

    async function register({ nome, email, senha, tipo, role, perfil, disciplina }) {
        const selectedRole = normalizeRole(role || tipo);
        const normalizedEmail = normalizeEmail(email);
        const init = window.OshetuFirebase?.initialize?.();

        if (selectedRole === "gestao") {
            return { ok: false, message: "O perfil do Gabinete Provincial nao pode ser criado por cadastro publico." };
        }

        if (!init?.ok) {
            return window.OkwetuData.registerUser({
                nome,
                email: normalizedEmail,
                senha,
                tipo: selectedRole,
                perfil,
                disciplina,
            });
        }

        try {
            const auth = window.OshetuFirebase.services().auth;
            const credential = await auth.createUserWithEmailAndPassword(normalizedEmail, senha);
            await credential.user.updateProfile({ displayName: nome });

            const user = publicUser(credential.user, {
                id: credential.user.uid,
                nome,
                email: normalizedEmail,
                role: selectedRole,
            });

            await window.OshetuDatabaseService.createUserProfile(credential.user.uid, user);
            await window.OshetuDatabaseService.createRoleProfile(user, { perfil, disciplina });
            await window.OshetuDatabaseService.hydrateLocalCache();

            saveLocalSession(user);
            return { ok: true, user, provider: "firebase" };
        } catch (error) {
            console.error("[OshetuAuth] Cadastro Firebase falhou.", error);
            return { ok: false, message: firebaseErrorMessage(error), error };
        }
    }

    async function login(email, senha, options = {}) {
        const normalizedEmail = normalizeEmail(email);
        const init = window.OshetuFirebase?.initialize?.();

        if (!init?.ok) {
            return window.OkwetuData.login(normalizedEmail, senha, options);
        }

        try {
            const auth = window.OshetuFirebase.services().auth;
            const credential = await auth.signInWithEmailAndPassword(normalizedEmail, senha);
            const profile = await getFirebaseProfile(credential.user.uid);
            const user = publicUser(credential.user, profile || {});

            if (options.requireRole && user.role !== options.requireRole) {
                await auth.signOut();
                saveLocalSession(null);
                return { ok: false, message: "Este acesso e reservado ao Gabinete Provincial da Educacao." };
            }
            if (options.institution && user.role === "gestao") {
                const expected = String(profile?.institutionalName || profile?.nome || "Gabinete Provincial da Educacao").trim().toLowerCase();
                if (String(options.institution).trim().toLowerCase() !== expected) {
                    await auth.signOut();
                    saveLocalSession(null);
                    return { ok: false, message: "Entidade institucional nao reconhecida para este acesso." };
                }
            }

            saveLocalSession(user);
            await window.OshetuDatabaseService.hydrateLocalCache();
            await window.OshetuDatabaseService.trackAnalytics("auth.login", { userId: user.id, role: user.role });

            return { ok: true, user, provider: "firebase" };
        } catch (error) {
            console.error("[OshetuAuth] Login Firebase falhou.", error);
            return { ok: false, message: firebaseErrorMessage(error), error };
        }
    }

    async function logout() {
        const auth = window.OshetuFirebase?.services?.().auth;
        if (auth?.currentUser) await auth.signOut();
        saveLocalSession(null);
        window.OkwetuData?.logout?.();
    }

    function getCurrentUser() {
        const raw = localStorage.getItem("usuario");
        return raw ? JSON.parse(raw) : null;
    }

    function onSession(callback) {
        const init = window.OshetuFirebase?.initialize?.();
        if (!init?.ok) {
            callback(getCurrentUser());
            return () => {};
        }

        const auth = window.OshetuFirebase.services().auth;
        return auth.onAuthStateChanged(async (firebaseUser) => {
            if (!firebaseUser) {
                saveLocalSession(null);
                callback(null);
                return;
            }

            const profile = await getFirebaseProfile(firebaseUser.uid);
            const user = saveLocalSession(publicUser(firebaseUser, profile || {}));
            callback(user);
        });
    }

    function ready() {
        if (sessionReadyPromise) return sessionReadyPromise;

        const init = window.OshetuFirebase?.initialize?.();
        if (!init?.ok) {
            sessionReadyPromise = Promise.resolve(getCurrentUser());
            return sessionReadyPromise;
        }

        sessionReadyPromise = new Promise((resolve) => {
            const unsubscribe = onSession(async (user) => {
                if (user) await window.OshetuDatabaseService.hydrateLocalCache();
                unsubscribe?.();
                resolve(user);
            });
        });

        return sessionReadyPromise;
    }

    function routeForRole(role) {
        return ROLE_ROUTES[normalizeRole(role)] || "login.html";
    }

    function requireRole(role) {
        const user = getCurrentUser();
        if (!user || normalizeRole(user.role || user.tipo) !== role) {
            window.location.href = "login.html";
            return null;
        }
        return user;
    }

    function firebaseErrorMessage(error) {
        const code = error?.code || "";
        if (code.includes("email-already-in-use")) return "Ja existe uma conta com este email.";
        if (code.includes("invalid-email")) return "Introduce um email valido.";
        if (code.includes("weak-password")) return "A senha precisa ser mais forte.";
        if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
            return "Email ou senha invalidos. Tenta novamente.";
        }
        if (code.includes("network-request-failed")) return "Sem ligacao ao Firebase. Verifica a internet.";
        return "Nao foi possivel concluir a autenticacao agora.";
    }

    window.OshetuAuthService = {
        register,
        login,
        logout,
        onSession,
        ready,
        getCurrentUser,
        routeForRole,
        requireRole,
    };
})();
