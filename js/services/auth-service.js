(function () {
    function normalizeRole(role) {
        return ["aluno", "professor", "gestao"].includes(role) ? role : "aluno";
    }

    function publicUser(firebaseUser, profile = {}) {
        return {
            id: profile.id || firebaseUser?.uid || profile.email,
            nome: profile.nome || firebaseUser?.displayName || "Utilizador Oshetu",
            email: profile.email || firebaseUser?.email || "",
            role: normalizeRole(profile.role || profile.tipo),
            tipo: normalizeRole(profile.role || profile.tipo),
            avatar: profile.avatar || firebaseUser?.photoURL || "",
            createdAt: profile.createdAt || null,
            updatedAt: profile.updatedAt || null,
        };
    }

    async function saveUserProfile(uid, payload) {
        const result = await window.OshetuDatabaseService.create("users", {
            id: uid,
            nome: payload.nome,
            email: payload.email,
            role: normalizeRole(payload.role || payload.tipo),
            avatar: payload.avatar || "",
        }, uid);
        return result.ok ? { id: uid, ...payload, role: normalizeRole(payload.role || payload.tipo) } : null;
    }

    async function register({ nome, email, senha, tipo, role, perfil, disciplina }) {
        const init = window.OshetuFirebase?.initialize?.();
        if (!init?.ok) {
            return window.OkwetuData.registerUser({ nome, email, senha, tipo: normalizeRole(role || tipo), perfil, disciplina });
        }

        const credential = await window.OshetuFirebase.services().auth.createUserWithEmailAndPassword(email, senha);
        await credential.user.updateProfile({ displayName: nome });
        const profile = await saveUserProfile(credential.user.uid, { nome, email, role: role || tipo });
        const user = publicUser(credential.user, profile);
        await window.OshetuDatabaseService.createRoleProfile(user, { perfil, disciplina });
        localStorage.setItem("usuario", JSON.stringify(user));
        localStorage.setItem("oshetu_last_email", email);
        return { ok: true, user, provider: "firebase" };
    }

    async function login(email, senha) {
        const init = window.OshetuFirebase?.initialize?.();
        if (!init?.ok) return window.OkwetuData.login(email, senha);

        const credential = await window.OshetuFirebase.services().auth.signInWithEmailAndPassword(email, senha);
        const profile = await window.OshetuDatabaseService.get("users", credential.user.uid);
        const user = publicUser(credential.user, profile || {});
        localStorage.setItem("usuario", JSON.stringify(user));
        localStorage.setItem("oshetu_last_email", email);
        return { ok: true, user, provider: "firebase" };
    }

    async function logout() {
        const auth = window.OshetuFirebase?.services?.().auth;
        if (auth) await auth.signOut();
        window.OkwetuData?.logout?.();
    }

    function getCurrentUser() {
        const raw = localStorage.getItem("usuario");
        return raw ? JSON.parse(raw) : null;
    }

    function routeForRole(role) {
        return window.OkwetuData.routeForRole(normalizeRole(role));
    }

    function requireRole(role) {
        const user = getCurrentUser();
        if (!user || normalizeRole(user.role || user.tipo) !== role) {
            window.location.href = "login.html";
            return null;
        }
        return user;
    }

    window.OshetuAuthService = { register, login, logout, getCurrentUser, routeForRole, requireRole };
})();
