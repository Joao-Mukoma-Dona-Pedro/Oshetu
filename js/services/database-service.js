(function () {
    const COLLECTIONS = {
        users: "users",
        students: "students",
        teachers: "teachers",
        management: "management",
        classes: "classes",
        turmas: "turmas",
        assignments: "assignments",
        lessons: "lessons",
        analytics: "analytics",
        notifications: "notifications",
        aiInsights: "aiInsights",
        recommendations: "recommendations",
        performanceAnalysis: "performanceAnalysis",
    };

    function firestore() {
        const init = window.OshetuFirebase?.initialize?.();
        return init?.ok ? window.OshetuFirebase.services().db : null;
    }

    function withAudit(payload) {
        return {
            ...payload,
            updatedAt: window.OshetuFirebase?.serverTimestamp?.() || new Date().toISOString(),
            createdAt: payload.createdAt || window.OshetuFirebase?.serverTimestamp?.() || new Date().toISOString(),
        };
    }

    async function create(collectionName, payload, id = null) {
        const db = firestore();
        if (!db) return { ok: false, provider: "local", reason: "firebase-unavailable" };
        const ref = id ? db.collection(collectionName).doc(id) : db.collection(collectionName).doc();
        await ref.set(withAudit({ id: ref.id, ...payload }), { merge: true });
        return { ok: true, id: ref.id, provider: "firebase" };
    }

    async function update(collectionName, id, payload) {
        const db = firestore();
        if (!db) return { ok: false, provider: "local", reason: "firebase-unavailable" };
        await db.collection(collectionName).doc(id).set({ ...payload, updatedAt: window.OshetuFirebase.serverTimestamp() }, { merge: true });
        return { ok: true, id, provider: "firebase" };
    }

    async function get(collectionName, id) {
        const db = firestore();
        if (!db) return null;
        const doc = await db.collection(collectionName).doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    async function list(collectionName, options = {}) {
        const db = firestore();
        if (!db) return [];
        let query = db.collection(collectionName);
        (options.where || []).forEach(([field, operator, value]) => {
            query = query.where(field, operator, value);
        });
        if (options.limit) query = query.limit(options.limit);
        const snapshot = await query.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async function createRoleProfile(user, extra = {}) {
        if (user.role === "professor") {
            return create(COLLECTIONS.teachers, {
                userId: user.id,
                nome: user.nome,
                email: user.email,
                disciplina: extra.disciplina || "Disciplina Geral",
                classes: extra.classes || ["10a Classe"],
                turmas: extra.turmas || ["A", "B"],
                aulas: [],
                tarefas: [],
                analytics: {},
            }, user.id);
        }

        if (user.role === "gestao") {
            return create(COLLECTIONS.management, {
                userId: user.id,
                visaoGeral: {},
                metricas: {},
                analytics: {},
                alertas: [],
                insightsFuturosIA: [],
            }, user.id);
        }

        return create(COLLECTIONS.students, {
            userId: user.id,
            nome: user.nome,
            email: user.email,
            perfil: extra.perfil || "tecnologia",
            classe: extra.classe || "10a Classe",
            turma: extra.turma || "A",
            progresso: 0,
            media: 0,
            aulasAssistidas: 0,
            tarefas: [],
            badges: [],
            metas: [],
        }, user.id);
    }

    async function trackAnalytics(name, payload = {}) {
        const result = await create(COLLECTIONS.analytics, { name, payload, source: "oshetu-web" });
        if (!result.ok) {
            window.OshetuStorage?.append?.("analytics-events", { name, payload, createdAt: new Date().toISOString() });
        }
        return result;
    }

    async function saveAIPlaceholder(collectionName, payload) {
        const allowed = [COLLECTIONS.aiInsights, COLLECTIONS.recommendations, COLLECTIONS.performanceAnalysis];
        if (!allowed.includes(collectionName)) return { ok: false, reason: "invalid-ai-collection" };
        return create(collectionName, { ...payload, provider: "gemini-api-future", status: "mock" });
    }

    async function uploadProfileAvatar(userId, file) {
        const storage = window.OshetuFirebase?.services?.().storage;
        if (!storage || !userId || !file) return { ok: false, reason: "storage-unavailable" };
        const extension = file.name?.split(".").pop() || "jpg";
        const ref = storage.ref(`avatars/${userId}/profile.${extension}`);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        await update(COLLECTIONS.users, userId, { avatar: url });
        return { ok: true, url };
    }

    window.OshetuDatabaseService = {
        COLLECTIONS,
        create,
        update,
        get,
        list,
        createRoleProfile,
        trackAnalytics,
        saveAIPlaceholder,
        uploadProfileAvatar,
    };
})();
