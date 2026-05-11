(function () {
    const LOCAL_STATE_KEY = "okwetu-school-data";
    const COLLECTIONS = {
        users: "users",
        students: "students",
        teachers: "teachers",
        management: "management",
        analytics: "analytics",
        notifications: "notifications",
        aiInsights: "aiInsights",
        classes: "classes",
        turmas: "turmas",
        assignments: "assignments",
        lessons: "lessons",
    };

    function db() {
        const init = window.OshetuFirebase?.initialize?.();
        return init?.ok ? window.OshetuFirebase.services().db : null;
    }

    function storage() {
        const init = window.OshetuFirebase?.initialize?.();
        return init?.ok ? window.OshetuFirebase.services().storage : null;
    }

    function now() {
        return window.OshetuFirebase?.serverTimestamp?.() || new Date().toISOString();
    }

    function localState() {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_STATE_KEY) || "{}");
        } catch (error) {
            console.warn("[OshetuDatabase] Estado local invalido.", error);
            return {};
        }
    }

    function saveLocalState(state) {
        localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
        if (Array.isArray(state.users)) {
            localStorage.setItem("usuarios", JSON.stringify(state.users));
        }
        return state;
    }

    function audit(payload = {}) {
        return {
            ...payload,
            updatedAt: now(),
            createdAt: payload.createdAt || now(),
        };
    }

    function cleanUndefined(value) {
        if (Array.isArray(value)) return value.map(cleanUndefined);
        if (!value || typeof value !== "object") return value;
        return Object.fromEntries(
            Object.entries(value)
                .filter(([, item]) => item !== undefined)
                .map(([key, item]) => [key, cleanUndefined(item)])
        );
    }

    function docData(doc) {
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    async function create(collectionName, payload, id = null) {
        const firestore = db();
        if (!firestore) return { ok: false, provider: "local", reason: "firebase-unavailable" };

        const ref = id ? firestore.collection(collectionName).doc(id) : firestore.collection(collectionName).doc();
        await ref.set(cleanUndefined(audit({ id: ref.id, ...payload })), { merge: true });
        return { ok: true, id: ref.id, provider: "firebase" };
    }

    async function update(collectionName, id, payload) {
        const firestore = db();
        if (!firestore || !id) return { ok: false, provider: "local", reason: "firebase-unavailable" };

        await firestore.collection(collectionName).doc(id).set(cleanUndefined({ ...payload, updatedAt: now() }), { merge: true });
        return { ok: true, id, provider: "firebase" };
    }

    async function get(collectionName, id) {
        const firestore = db();
        if (!firestore || !id) return null;

        return docData(await firestore.collection(collectionName).doc(id).get());
    }

    async function list(collectionName, options = {}) {
        const firestore = db();
        if (!firestore) return [];

        let query = firestore.collection(collectionName);
        (options.where || []).forEach(([field, operator, value]) => {
            query = query.where(field, operator, value);
        });
        (options.orderBy || []).forEach(([field, direction]) => {
            query = query.orderBy(field, direction);
        });
        if (options.limit) query = query.limit(options.limit);

        const snapshot = await query.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async function createUserProfile(uid, payload) {
        return create(COLLECTIONS.users, {
            id: uid,
            nome: payload.nome,
            email: payload.email,
            role: payload.role || payload.tipo || "aluno",
            avatar: payload.avatar || "",
        }, uid);
    }

    async function createRoleProfile(user, extra = {}) {
        const role = user.role || user.tipo || "aluno";

        if (role === "professor") {
            return create(COLLECTIONS.teachers, {
                userId: user.id,
                nome: user.nome,
                email: user.email,
                disciplina: extra.disciplina || "Disciplina Geral",
                resumo: extra.resumo || "Professor registado recentemente.",
                classes: extra.classes || ["10a Classe", "11a Classe", "12a Classe", "13a Classe"],
                turmas: extra.turmas || ["A", "B"],
                lessons: [],
                assignments: [],
                analytics: {},
            }, user.id);
        }

        if (role === "gestao") {
            return create(COLLECTIONS.management, {
                userId: user.id,
                nome: user.nome,
                email: user.email,
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
            classe: extra.classe || "11a Classe",
            turma: extra.turma || "A",
            bio: "Novo aluno registado na plataforma.",
            progresso: 0,
            media: 0,
            aulasAssistidas: 0,
            tarefas: [],
            badges: [],
            metas: [],
        }, user.id);
    }

    async function upsertLesson(teacherEmail, lesson) {
        const teachers = await list(COLLECTIONS.teachers, { where: [["email", "==", teacherEmail]], limit: 1 });
        const teacher = teachers[0];
        if (!teacher) return { ok: false, reason: "teacher-not-found" };

        await create(COLLECTIONS.lessons, {
            ...lesson,
            teacherId: teacher.id,
            teacherEmail,
            disciplina: teacher.disciplina,
        }, lesson.id);
        return hydrateTeacherArrays(teacher.id);
    }

    async function upsertAssignment(teacherEmail, assignment) {
        const teachers = await list(COLLECTIONS.teachers, { where: [["email", "==", teacherEmail]], limit: 1 });
        const teacher = teachers[0];
        if (!teacher) return { ok: false, reason: "teacher-not-found" };

        await create(COLLECTIONS.assignments, {
            ...assignment,
            teacherId: teacher.id,
            teacherEmail,
            disciplina: teacher.disciplina,
        }, assignment.id);
        return hydrateTeacherArrays(teacher.id);
    }

    async function updateLessonViewed(teacherEmail, lessonId, studentEmail) {
        const lesson = await get(COLLECTIONS.lessons, lessonId);
        if (!lesson) return { ok: false, reason: "lesson-not-found" };
        const watchedBy = Array.from(new Set([...(lesson.watchedBy || []), studentEmail]));
        return update(COLLECTIONS.lessons, lessonId, { watchedBy, teacherEmail });
    }

    async function submitAssignment(teacherEmail, assignmentId, submission) {
        const assignment = await get(COLLECTIONS.assignments, assignmentId);
        if (!assignment) return { ok: false, reason: "assignment-not-found" };

        const submissions = [...(assignment.submissions || [])];
        const index = submissions.findIndex((item) => item.studentEmail === submission.studentEmail);
        if (index >= 0) submissions[index] = { ...submissions[index], ...submission };
        else submissions.push(submission);

        return update(COLLECTIONS.assignments, assignmentId, { submissions, teacherEmail });
    }

    async function hydrateTeacherArrays(teacherId) {
        const [teacher, lessons, assignments] = await Promise.all([
            get(COLLECTIONS.teachers, teacherId),
            list(COLLECTIONS.lessons, { where: [["teacherId", "==", teacherId]] }),
            list(COLLECTIONS.assignments, { where: [["teacherId", "==", teacherId]] }),
        ]);
        if (!teacher) return { ok: false, reason: "teacher-not-found" };

        return update(COLLECTIONS.teachers, teacherId, { lessons, assignments });
    }

    async function uploadProfileAvatar(userId, file) {
        const bucket = storage();
        if (!bucket || !userId || !file) return { ok: false, reason: "storage-unavailable" };

        const extension = file.name?.split(".").pop() || "jpg";
        const path = `avatars/${userId}/profile.${extension}`;
        const ref = bucket.ref(path);
        await ref.put(file, { contentType: file.type });
        const url = await ref.getDownloadURL();
        await update(COLLECTIONS.users, userId, { avatar: url });
        return { ok: true, url, path };
    }

    async function trackAnalytics(name, payload = {}) {
        const result = await create(COLLECTIONS.analytics, {
            name,
            payload,
            source: "oshetu-web",
        });

        if (!result.ok) {
            window.OshetuStorage?.append?.("analytics-events", { name, payload, createdAt: new Date().toISOString() });
        }

        return result;
    }

    async function createNotification(payload = {}) {
        return create(COLLECTIONS.notifications, {
            title: payload.title || "Notificacao",
            message: payload.message || "",
            role: payload.role || "todos",
            userId: payload.userId || null,
            read: false,
            type: payload.type || "info",
        });
    }

    async function saveAIPlaceholder(collectionName, payload = {}) {
        const allowed = [COLLECTIONS.aiInsights, "recommendations", "performanceAnalysis"];
        if (!allowed.includes(collectionName)) return { ok: false, reason: "invalid-ai-collection" };

        return create(collectionName, {
            ...payload,
            status: "mock",
            provider: "gemini-api-future",
        });
    }

    async function seedFirestoreFromLocal() {
        const firestore = db();
        if (!firestore || !window.OkwetuData) return { ok: false, reason: "firebase-unavailable" };

        const state = localState();
        const dashboard = window.OkwetuData.getManagementDashboard();
        const users = Array.isArray(state.users) ? state.users : [];
        const students = Array.isArray(state.students) ? state.students : [];
        const teachers = Array.isArray(state.teachers) ? state.teachers : [];

        await Promise.all(users.map((user) => {
            const id = user.id || user.email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
            return create(COLLECTIONS.users, {
                nome: user.nome,
                email: user.email,
                role: user.role || user.tipo,
                avatar: user.avatar || "",
                legacyId: id,
            }, id);
        }));

        await Promise.all(students.map((student) => {
            const id = student.id || student.email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
            const metrics = window.OkwetuData.calculateStudentMetrics(student.email);
            return create(COLLECTIONS.students, { ...student, ...metrics, userId: id }, id);
        }));

        await Promise.all(teachers.map(async (teacher) => {
            const id = teacher.id || teacher.email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
            await create(COLLECTIONS.teachers, { ...teacher, userId: id }, id);
            await Promise.all((teacher.lessons || []).map((lesson) => create(COLLECTIONS.lessons, {
                ...lesson,
                teacherId: id,
                teacherEmail: teacher.email,
                disciplina: teacher.disciplina,
            }, lesson.id)));
            await Promise.all((teacher.assignments || []).map((assignment) => create(COLLECTIONS.assignments, {
                ...assignment,
                teacherId: id,
                teacherEmail: teacher.email,
                disciplina: teacher.disciplina,
            }, assignment.id)));
        }));

        await create(COLLECTIONS.management, {
            visaoGeral: {
                totalStudents: dashboard.totalStudents,
                totalTeachers: dashboard.totalTeachers,
                totalClasses: dashboard.totalClasses,
                totalTurmas: dashboard.totalTurmas,
            },
            metricas: dashboard.turmaPerformance,
            analytics: dashboard.studentPerformance,
            alertas: [],
            insightsFuturosIA: [],
        }, "overview");

        return { ok: true, provider: "firebase" };
    }

    async function hydrateLocalCache() {
        const firestore = db();
        if (!firestore) return { ok: false, provider: "local", reason: "firebase-unavailable" };

        const [users, students, teachers, lessons, assignments] = await Promise.all([
            list(COLLECTIONS.users),
            list(COLLECTIONS.students),
            list(COLLECTIONS.teachers),
            list(COLLECTIONS.lessons),
            list(COLLECTIONS.assignments),
        ]);

        if (!users.length && !students.length && !teachers.length) {
            return { ok: false, provider: "firebase", reason: "empty-firestore" };
        }

        const state = localState();
        const legacyUsers = Array.isArray(state.users) ? state.users : [];
        state.users = users.map((user) => {
            const legacy = legacyUsers.find((item) => item.email === user.email) || {};
            return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.role || user.tipo,
            role: user.role || user.tipo,
            avatar: user.avatar || "",
            senha: legacy.senha,
        };
        });
        state.students = students.map((student) => ({
            ...student,
            nome: student.nome,
            email: student.email,
        }));
        state.teachers = teachers.map((teacher) => ({
            ...teacher,
            lessons: lessons.filter((lesson) => lesson.teacherId === teacher.id || lesson.teacherEmail === teacher.email),
            assignments: assignments.filter((assignment) => assignment.teacherId === teacher.id || assignment.teacherEmail === teacher.email),
        }));

        saveLocalState(state);
        return { ok: true, provider: "firebase" };
    }

    window.OshetuDatabaseService = {
        COLLECTIONS,
        create,
        update,
        get,
        list,
        createUserProfile,
        createRoleProfile,
        upsertLesson,
        upsertAssignment,
        updateLessonViewed,
        submitAssignment,
        uploadProfileAvatar,
        trackAnalytics,
        createNotification,
        saveAIPlaceholder,
        seedFirestoreFromLocal,
        hydrateLocalCache,
    };
})();
