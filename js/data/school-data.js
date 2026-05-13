const OkwetuData = (() => {
    const STORAGE_KEY = "okwetu-school-data";
    const TRACKS = {
        ciencias: {
            label: "Ciencias",
            classe: "10a Classe",
            disciplinas: ["Matematica", "Fisica", "Quimica"],
        },
        tecnologia: {
            label: "Tecnologia",
            classe: "11a Classe",
            disciplinas: ["Programacao", "Matematica", "Empreendedorismo"],
        },
        humanidades: {
            label: "Humanidades",
            classe: "12a Classe",
            disciplinas: ["Historia", "Portugues", "Sociologia", "Matematica"],
        },
    };
    const AVATAR_COLORS = ["#2E89DB", "#1D8F59", "#8C63E6", "#D4861A", "#C44747", "#0F376D"];

    const DEMO_STATE = {
        users: [
            { nome: "Ana Silva", email: "ana@okwetu.com", senha: "1234", tipo: "aluno" },
            { nome: "Carlos Neto", email: "carlos@okwetu.com", senha: "1234", tipo: "aluno" },
            { nome: "Lucia Mendes", email: "lucia@okwetu.com", senha: "1234", tipo: "aluno" },
            { nome: "Prof. Mateus", email: "mateus@okwetu.com", senha: "1234", tipo: "professor" },
            { nome: "Prof. Elisa", email: "elisa@okwetu.com", senha: "1234", tipo: "professor" },
            { nome: "Prof. Dario", email: "dario@okwetu.com", senha: "1234", tipo: "professor" },
            { nome: "Gestao Central", email: "gestao@okwetu.com", senha: "1234", tipo: "gestao" },
        ],
        province: {
            id: "gpe-luanda",
            name: "Gabinete Provincial da Educacao",
            province: "Luanda",
            scope: "Supervisao provincial",
        },
        schools: [
            {
                id: "esc-central-luanda",
                nome: "Escola Central de Luanda",
                endereco: "Rua da Educacao, Maianga",
                municipio: "Luanda",
                nivelEnsino: "Ensino Secundario",
                contatos: "+244 900 000 001",
                nif: "500000001",
                codigoEscolar: "LDA-SEC-001",
                responsavel: "Direcao Pedagogica Central",
                status: "ativa",
            },
            {
                id: "esc-kilamba",
                nome: "Complexo Escolar do Kilamba",
                endereco: "Centralidade do Kilamba",
                municipio: "Belas",
                nivelEnsino: "I e II Ciclo",
                contatos: "+244 900 000 002",
                nif: "",
                codigoEscolar: "BLS-MIX-002",
                responsavel: "Coordenacao Pedagogica",
                status: "ativa",
            },
        ],
        curriculum: [
            {
                id: "cur-mat-10-eq1",
                classe: "10a Classe",
                disciplina: "Matematica",
                topico: "Equacoes do primeiro grau",
                periodo: "1o trimestre - semana 1",
                expectedBy: "2026-05-17",
                masteryTarget: 70,
            },
            {
                id: "cur-fis-10-medidas",
                classe: "10a Classe",
                disciplina: "Fisica",
                topico: "Grandezas e medidas",
                periodo: "1o trimestre - semana 2",
                expectedBy: "2026-05-24",
                masteryTarget: 65,
            },
            {
                id: "cur-port-12-texto",
                classe: "12a Classe",
                disciplina: "Portugues",
                topico: "Interpretacao textual",
                periodo: "1o trimestre - semana 1",
                expectedBy: "2026-05-17",
                masteryTarget: 75,
            },
        ],
        provincialAssessments: [
            {
                id: "assess-mat-10-eq1",
                title: "Verificacao provincial de Matematica",
                classe: "10a Classe",
                disciplina: "Matematica",
                topic: "Equacoes do primeiro grau",
                scheduledFor: "2026-05-15",
                status: "programada",
                schoolIds: ["esc-central-luanda", "esc-kilamba"],
                questions: [
                    {
                        id: "q1",
                        text: "Qual e o valor de x em 2x + 4 = 10?",
                        options: ["2", "3", "4", "5"],
                        correctIndex: 1,
                    },
                    {
                        id: "q2",
                        text: "A equacao x - 7 = 0 tem como solucao:",
                        options: ["-7", "0", "7", "14"],
                        correctIndex: 2,
                    },
                ],
                responses: [],
            },
        ],
        students: [
            { email: "ana@okwetu.com", nome: "Ana Silva", perfil: "ciencias", classe: "10a Classe", turma: "A", schoolId: "esc-central-luanda", bio: "Foco em matematica aplicada e ciencias exatas." },
            { email: "carlos@okwetu.com", nome: "Carlos Neto", perfil: "tecnologia", classe: "11a Classe", turma: "A", schoolId: "esc-kilamba", bio: "Interesse em logica, criacao digital e projetos praticos." },
            { email: "lucia@okwetu.com", nome: "Lucia Mendes", perfil: "humanidades", classe: "12a Classe", turma: "B", schoolId: "esc-central-luanda", bio: "Gosta de leitura critica, historia e comunicacao." },
        ],
        teachers: [
            {
                email: "mateus@okwetu.com",
                nome: "Prof. Mateus",
                disciplina: "Matematica",
                resumo: "Especialista em aprendizagem orientada por resultados e reforco semanal.",
                classes: ["10a Classe", "11a Classe", "12a Classe", "13a Classe"],
                turmas: ["A", "B"],
                lessons: [
                    {
                        id: "lesson-mat-1",
                        title: "Funcoes lineares",
                        date: "2026-05-01",
                        summary: "Conceitos basicos, grafico e exercicios guiados.",
                        resources: ["guia-funcoes.pdf", "lista-exercicios.pdf"],
                        video: "Aula gravada disponivel na sala virtual",
                        watchedBy: ["ana@okwetu.com", "carlos@okwetu.com"],
                    },
                    {
                        id: "lesson-mat-2",
                        title: "Equacoes do 2o grau",
                        date: "2026-05-02",
                        summary: "Metodo resolutivo e aplicacao pratica.",
                        resources: ["equacoes-2grau.pdf"],
                        video: "Explicacao com resolucao comentada",
                        watchedBy: ["ana@okwetu.com"],
                    },
                ],
                assignments: [
                    {
                        id: "assign-mat-1",
                        title: "Ficha 1 de Matematica",
                        deadline: "2026-05-09",
                        description: "Resolver os 8 exercicios e enviar a estrategia usada.",
                        submissions: [
                            {
                                studentEmail: "ana@okwetu.com",
                                content: "Enviei a ficha resolvida e explicacao do raciocinio.",
                                submittedAt: "2026-05-02",
                                status: "Corrigido",
                                score: 18,
                            },
                            {
                                studentEmail: "carlos@okwetu.com",
                                content: "Entreguei os exercicios 1 a 6 com anotacoes.",
                                submittedAt: "2026-05-03",
                                status: "Em analise",
                                score: null,
                            },
                        ],
                    },
                ],
            },
            {
                email: "elisa@okwetu.com",
                nome: "Prof. Elisa",
                disciplina: "Programacao",
                resumo: "Conduz projetos praticos com foco em logica e criacao digital.",
                classes: ["11a Classe", "12a Classe"],
                turmas: ["A", "B"],
                lessons: [
                    {
                        id: "lesson-prog-1",
                        title: "Introducao ao JavaScript",
                        date: "2026-05-01",
                        summary: "Variaveis, condicoes e estrutura do navegador.",
                        resources: ["javascript-intro.pdf"],
                        video: "Laboratorio guiado gravado",
                        watchedBy: ["carlos@okwetu.com"],
                    },
                ],
                assignments: [
                    {
                        id: "assign-prog-1",
                        title: "Mini projeto de interface",
                        deadline: "2026-05-12",
                        description: "Criar uma tela simples com HTML, CSS e interacao basica.",
                        submissions: [],
                    },
                ],
            },
            {
                email: "dario@okwetu.com",
                nome: "Prof. Dario",
                disciplina: "Historia",
                resumo: "Trabalha com analise critica, leitura e sintese historica.",
                classes: ["10a Classe", "12a Classe"],
                turmas: ["A", "B"],
                lessons: [
                    {
                        id: "lesson-hist-1",
                        title: "Independencias africanas",
                        date: "2026-05-03",
                        summary: "Contextos historicos, liderancas e impactos sociais.",
                        resources: ["independencias-africanas.pdf"],
                        video: "Mesa redonda em video",
                        watchedBy: ["lucia@okwetu.com"],
                    },
                ],
                assignments: [
                    {
                        id: "assign-hist-1",
                        title: "Resumo historico orientado",
                        deadline: "2026-05-10",
                        description: "Produzir um resumo critico com tres referencias do tema.",
                        submissions: [
                            {
                                studentEmail: "lucia@okwetu.com",
                                content: "Resumo enviado com comentarios pessoais e fontes.",
                                submittedAt: "2026-05-03",
                                status: "Corrigido",
                                score: 17,
                            },
                        ],
                    },
                ],
            },
        ],
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function initialsFor(name) {
        return (name || "OS")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("");
    }

    function colorForValue(value) {
        const total = Array.from(value || "").reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return AVATAR_COLORS[total % AVATAR_COLORS.length];
    }

    function avatarSvg(name, color) {
        const initials = initialsFor(name);
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
                <rect width="160" height="160" rx="36" fill="${color}"/>
                <circle cx="124" cy="36" r="18" fill="rgba(255,255,255,0.18)"/>
                <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
                    font-family="Segoe UI, Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff">${initials}</text>
            </svg>
        `;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function ensureUserAvatar(user) {
        if (!user.avatar) {
            user.avatar = avatarSvg(user.nome, colorForValue(user.email || user.nome));
        }
    }

    function syncLegacyUsers(state) {
        localStorage.setItem("usuarios", JSON.stringify(state.users));
    }

    function migrateState(state) {
        state.users = state.users || [];
        state.province = state.province || clone(DEMO_STATE.province);
        state.schools = state.schools || clone(DEMO_STATE.schools);
        state.curriculum = state.curriculum || clone(DEMO_STATE.curriculum);
        state.provincialAssessments = state.provincialAssessments || clone(DEMO_STATE.provincialAssessments);
        state.students = state.students || [];
        state.teachers = state.teachers || [];
        state.analytics = state.analytics || {
            events: [],
            dashboardSnapshots: [],
            learningSignals: [],
        };
        state.ai = state.ai || {
            provider: "gemini-api-future",
            enabled: false,
            mockMode: true,
            collections: ["aiInsights", "recommendations", "performanceAnalysis"],
        };

        const humanidades = TRACKS.humanidades.disciplinas;
        if (!humanidades.includes("Matematica")) {
            humanidades.push("Matematica");
        }

        state.users.forEach(ensureUserAvatar);
        state.students.forEach((student) => {
            if (!student.bio) {
                student.bio = "Perfil academico em construcao.";
            }
            if (!student.schoolId) {
                student.schoolId = state.schools[0]?.id || "esc-central-luanda";
            }
        });
        state.teachers.forEach((teacher) => {
            if (!teacher.schoolId) {
                teacher.schoolId = state.schools[0]?.id || "esc-central-luanda";
            }
            if (!teacher.resumo) {
                teacher.resumo = "Professor registado recentemente. Perfil pedagogico em atualizacao.";
            }
            teacher.lessons = teacher.lessons || [];
            teacher.assignments = teacher.assignments || [];
            if (teacher.email === "mateus@okwetu.com") {
                teacher.classes = Array.from(new Set([...(teacher.classes || []), "10a Classe", "11a Classe", "12a Classe", "13a Classe"]));
            }
            teacher.lessons.forEach((lesson) => {
                lesson.resources = lesson.resources || lesson.pdfs || [];
                lesson.watchedBy = lesson.watchedBy || [];
                lesson.audienceClass = lesson.audienceClass || lesson.classe || "Todas";
                lesson.audienceTurma = lesson.audienceTurma || lesson.turma || "Todas";
            });
            teacher.assignments.forEach((assignment) => {
                assignment.submissions = assignment.submissions || [];
                assignment.audienceClass = assignment.audienceClass || assignment.classe || "Todas";
                assignment.audienceTurma = assignment.audienceTurma || assignment.turma || "Todas";
            });
        });
        state.provincialAssessments.forEach((assessment) => {
            assessment.schoolIds = assessment.schoolIds?.length ? assessment.schoolIds : state.schools.map((school) => school.id);
            assessment.questions = assessment.questions || [];
            assessment.responses = assessment.responses || [];
            assessment.status = assessment.status || "rascunho";
        });
        return state;
    }

    function writeState(state) {
        migrateState(state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        syncLegacyUsers(state);
    }

    function readState() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const initialState = migrateState(clone(DEMO_STATE));
            writeState(initialState);
            return initialState;
        }

        const state = migrateState(JSON.parse(raw));
        writeState(state);
        return state;
    }

    function createId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    }

    function getCurrentUser() {
        const raw = localStorage.getItem("usuario");
        return raw ? JSON.parse(raw) : null;
    }

    function persistCurrentUser(state, email) {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.email !== email) {
            return;
        }
        const updated = state.users.find((user) => user.email === email);
        if (updated) {
            localStorage.setItem("usuario", JSON.stringify(updated));
        }
    }

    function routeForRole(role) {
        if (role === "aluno") return "aluno.html";
        if (role === "professor") return "professor.html";
        if (role === "gestao") return "gestao.html";
        return "login.html";
    }

    function getTrackDetails(key) {
        return TRACKS[key] || TRACKS.tecnologia;
    }

    function getUserByEmail(email, state = readState()) {
        return state.users.find((user) => user.email === email) || null;
    }

    function getStudentByEmail(email, state = readState()) {
        return state.students.find((student) => student.email === email) || null;
    }

    function getTeacherByEmail(email, state = readState()) {
        return state.teachers.find((teacher) => teacher.email === email) || null;
    }

    function pickTurmaForClass(classe, state) {
        const classmates = state.students.filter((student) => student.classe === classe);
        const turmaA = classmates.filter((student) => student.turma === "A").length;
        const turmaB = classmates.filter((student) => student.turma === "B").length;
        return turmaA <= turmaB ? "A" : "B";
    }

    function createStudentRecord(user, perfil, state) {
        const track = getTrackDetails(perfil);
        return {
            email: user.email,
            nome: user.nome,
            perfil,
            classe: track.classe,
            turma: pickTurmaForClass(track.classe, state),
            schoolId: state.schools[0]?.id || "esc-central-luanda",
            bio: "Novo aluno registado na plataforma.",
        };
    }

    function createTeacherRecord(user, disciplina = "Disciplina Geral", state = readState()) {
        return {
            email: user.email,
            nome: user.nome,
            disciplina: disciplina || "Disciplina Geral",
            schoolId: state.schools[0]?.id || "esc-central-luanda",
            resumo: "Professor registado recentemente. Perfil pedagogico em atualizacao.",
            classes: ["10a Classe"],
            turmas: ["A", "B"],
            lessons: [],
            assignments: [],
        };
    }

    function registerUser({ nome, email, senha, tipo, perfil, disciplina }) {
        const state = readState();
        if (state.users.some((user) => user.email === email)) {
            return { ok: false, message: "Ja existe uma conta com este email." };
        }

        const newUser = { nome, email, senha, tipo };
        ensureUserAvatar(newUser);
        state.users.push(newUser);

        if (tipo === "aluno") {
            state.students.push(createStudentRecord(newUser, perfil || "tecnologia", state));
        }

        if (tipo === "professor") {
            state.teachers.push(createTeacherRecord(newUser, disciplina, state));
        }

        writeState(state);
        localStorage.setItem("usuario", JSON.stringify(newUser));
        localStorage.setItem("oshetu_last_email", email);
        return { ok: true, user: newUser };
    }

    function login(email, senha) {
        const state = readState();
        const user = state.users.find((item) => item.email === email && item.senha === senha);
        if (!user) {
            return { ok: false, message: "Email ou senha invalidos. Tenta novamente." };
        }

        localStorage.setItem("usuario", JSON.stringify(user));
        localStorage.setItem("oshetu_last_email", email);
        return { ok: true, user };
    }

    function logout() {
        localStorage.removeItem("usuario");
    }

    function requireRole(role) {
        const user = getCurrentUser();
        if (!user || user.tipo !== role) {
            window.location.href = "login.html";
            return null;
        }
        return user;
    }

    function updateAvatar(email, avatar) {
        const state = readState();
        const user = getUserByEmail(email, state);
        if (!user) return;
        user.avatar = avatar;
        writeState(state);
        persistCurrentUser(state, email);
    }

    function updateStudentProfile(email, payload) {
        const state = readState();
        const user = getUserByEmail(email, state);
        const student = getStudentByEmail(email, state);
        if (!user || !student) return;

        if (payload.nome) {
            user.nome = payload.nome;
            student.nome = payload.nome;
        }
        if (typeof payload.bio === "string") {
            student.bio = payload.bio;
        }
        if (payload.avatar) {
            user.avatar = payload.avatar;
        }

        writeState(state);
        persistCurrentUser(state, email);
    }

    function updateTeacherProfile(email, payload) {
        const state = readState();
        const user = getUserByEmail(email, state);
        const teacher = getTeacherByEmail(email, state);
        if (!user || !teacher) return;

        if (payload.nome) {
            user.nome = payload.nome;
            teacher.nome = payload.nome;
        }
        if (typeof payload.resumo === "string") {
            teacher.resumo = payload.resumo;
        }
        if (typeof payload.disciplina === "string" && payload.disciplina) {
            teacher.disciplina = payload.disciplina;
        }
        if (payload.avatar) {
            user.avatar = payload.avatar;
        }

        writeState(state);
        persistCurrentUser(state, email);
    }

    function updateManagementProfile(email, payload) {
        const state = readState();
        const user = getUserByEmail(email, state);
        if (!user) return;

        if (payload.nome) {
            user.nome = payload.nome;
        }
        if (payload.avatar) {
            user.avatar = payload.avatar;
        }

        writeState(state);
        persistCurrentUser(state, email);
    }

    function getStudentTeachers(student, state) {
        const track = getTrackDetails(student.perfil);
        return state.teachers.filter((teacher) => track.disciplinas.includes(teacher.disciplina));
    }

    function audienceMatchesStudent(item, student) {
        const classMatch = item.audienceClass === "Todas" || item.audienceClass === student.classe;
        const turmaMatch = item.audienceTurma === "Todas" || item.audienceTurma === student.turma;
        return classMatch && turmaMatch;
    }

    function audienceMatchesFilter(item, selectedClass = "Todas", selectedTurma = "Todas") {
        const classMatch = selectedClass === "Todas" || item.audienceClass === "Todas" || item.audienceClass === selectedClass;
        const turmaMatch = selectedTurma === "Todas" || item.audienceTurma === "Todas" || item.audienceTurma === selectedTurma;
        return classMatch && turmaMatch;
    }

    function studentHasTeacher(student, teacher) {
        const track = getTrackDetails(student.perfil);
        const hasTeacherSubject = track.disciplinas.includes(teacher.disciplina);
        const hasTeacherClass = !teacher.classes?.length || teacher.classes.includes(student.classe);
        const hasTeacherTurma = !teacher.turmas?.length || teacher.turmas.includes(student.turma);
        return hasTeacherSubject && hasTeacherClass && hasTeacherTurma;
    }

    function getStudentLessons(student, state = readState()) {
        const teachers = getStudentTeachers(student, state);
        return teachers.flatMap((teacher) =>
            teacher.lessons
                .filter((lesson) => audienceMatchesStudent(lesson, student))
                .map((lesson) => ({
                    teacherEmail: teacher.email,
                    teacherName: teacher.nome,
                    teacherAvatar: getUserByEmail(teacher.email, state)?.avatar || "",
                    disciplina: teacher.disciplina,
                    lesson,
                }))
        );
    }

    function getStudentAssignments(student, state = readState()) {
        const teachers = getStudentTeachers(student, state);
        return teachers.flatMap((teacher) =>
            teacher.assignments
                .filter((assignment) => audienceMatchesStudent(assignment, student))
                .map((assignment) => ({
                    teacherEmail: teacher.email,
                    teacherName: teacher.nome,
                    teacherAvatar: getUserByEmail(teacher.email, state)?.avatar || "",
                    disciplina: teacher.disciplina,
                    assignment,
                    submission: assignment.submissions.find((item) => item.studentEmail === student.email) || null,
                }))
        );
    }

    function calculateStudentMetrics(studentEmail, state = readState()) {
        const student = getStudentByEmail(studentEmail, state);
        if (!student) {
            return { aulasAssistidas: 0, totalAulas: 0, entregas: 0, totalTarefas: 0, media: 0, progresso: 0 };
        }

        const lessons = getStudentLessons(student, state);
        const assignments = getStudentAssignments(student, state);
        const watchedLessons = lessons.filter((item) => item.lesson.watchedBy.includes(student.email)).length;
        const deliveredAssignments = assignments.filter((item) => item.submission).length;
        const correctedScores = assignments.map((item) => item.submission?.score).filter((score) => typeof score === "number");
        const media = correctedScores.length ? correctedScores.reduce((sum, score) => sum + score, 0) / correctedScores.length : 0;
        const lessonRate = lessons.length ? (watchedLessons / lessons.length) * 100 : 0;
        const taskRate = assignments.length ? (deliveredAssignments / assignments.length) * 100 : 0;
        const noteRate = (media / 20) * 100;

        return {
            aulasAssistidas: watchedLessons,
            totalAulas: lessons.length,
            entregas: deliveredAssignments,
            totalTarefas: assignments.length,
            media: Number(media.toFixed(1)),
            progresso: Math.round((lessonRate + taskRate + noteRate) / 3),
        };
    }

    function markLessonViewed(studentEmail, teacherEmail, lessonId) {
        const state = readState();
        const teacher = getTeacherByEmail(teacherEmail, state);
        if (!teacher) return;

        const lesson = teacher.lessons.find((item) => item.id === lessonId);
        if (!lesson) return;

        if (!lesson.watchedBy.includes(studentEmail)) {
            lesson.watchedBy.push(studentEmail);
            writeState(state);
            trackEvent("lesson.viewed", { studentEmail, teacherEmail, lessonId });
        }
    }

    function submitAssignment(studentEmail, teacherEmail, assignmentId, content) {
        const state = readState();
        const teacher = getTeacherByEmail(teacherEmail, state);
        if (!teacher) return { ok: false, message: "Professor nao encontrado." };

        const assignment = teacher.assignments.find((item) => item.id === assignmentId);
        if (!assignment) return { ok: false, message: "Tarefa nao encontrada." };

        const existingSubmission = assignment.submissions.find((item) => item.studentEmail === studentEmail);
        const payload = {
            studentEmail,
            content,
            submittedAt: new Date().toISOString().split("T")[0],
            status: "Em analise",
            score: existingSubmission?.score ?? null,
        };

        if (existingSubmission) {
            Object.assign(existingSubmission, payload);
        } else {
            assignment.submissions.push(payload);
        }

        writeState(state);
        trackEvent("assignment.submitted", { studentEmail, teacherEmail, assignmentId });
        return { ok: true };
    }

    function addLesson(teacherEmail, payload) {
        const state = readState();
        const teacher = getTeacherByEmail(teacherEmail, state);
        if (!teacher) return;

        teacher.lessons.unshift({
            id: createId("lesson"),
            title: payload.title,
            date: payload.date,
            summary: payload.summary,
            resources: payload.resources,
            video: payload.video,
            audienceClass: payload.audienceClass || "Todas",
            audienceTurma: payload.audienceTurma || "Todas",
            watchedBy: [],
        });

        writeState(state);
        trackEvent("lesson.created", { teacherEmail, title: payload.title });
    }

    function addAssignment(teacherEmail, payload) {
        const state = readState();
        const teacher = getTeacherByEmail(teacherEmail, state);
        if (!teacher) return;

        teacher.assignments.unshift({
            id: createId("assignment"),
            title: payload.title,
            deadline: payload.deadline,
            description: payload.description,
            audienceClass: payload.audienceClass || "Todas",
            audienceTurma: payload.audienceTurma || "Todas",
            submissions: [],
        });

        writeState(state);
        trackEvent("assignment.created", { teacherEmail, title: payload.title });
    }

    function trackEvent(name, payload = {}) {
        const state = readState();
        const event = {
            id: createId("event"),
            name,
            payload,
            createdAt: new Date().toISOString(),
        };

        state.analytics.events.push(event);
        writeState(state);
        return event;
    }

    function saveDashboardSnapshot(role, metrics = {}) {
        const state = readState();
        const snapshot = {
            id: createId("snapshot"),
            role,
            metrics,
            createdAt: new Date().toISOString(),
        };

        state.analytics.dashboardSnapshots.push(snapshot);
        writeState(state);
        return snapshot;
    }

    function getAIConfig() {
        return clone(readState().ai);
    }

    function getSchoolById(id, state = readState()) {
        return state.schools.find((school) => school.id === id) || null;
    }

    function addSchool(payload) {
        const state = readState();
        const school = {
            id: createId("school"),
            nome: payload.nome,
            endereco: payload.endereco,
            municipio: payload.municipio,
            nivelEnsino: payload.nivelEnsino,
            contatos: payload.contatos,
            nif: payload.nif || "",
            codigoEscolar: payload.codigoEscolar,
            responsavel: payload.responsavel || "Direcao escolar",
            status: "ativa",
            createdAt: new Date().toISOString(),
        };

        state.schools.push(school);
        writeState(state);
        trackEvent("school.created", { schoolId: school.id, municipio: school.municipio });
        return school;
    }

    function createProvincialAssessment(payload) {
        const state = readState();
        const questions = (payload.questions || []).filter((question) => question.text && question.options?.length);
        const assessment = {
            id: createId("assessment"),
            title: payload.title,
            classe: payload.classe,
            disciplina: payload.disciplina,
            topic: payload.topic,
            scheduledFor: payload.scheduledFor,
            status: payload.status || "programada",
            schoolIds: payload.schoolIds?.length ? payload.schoolIds : state.schools.map((school) => school.id),
            questions,
            responses: [],
            createdAt: new Date().toISOString(),
        };

        state.provincialAssessments.unshift(assessment);
        writeState(state);
        trackEvent("provincial-assessment.created", {
            assessmentId: assessment.id,
            disciplina: assessment.disciplina,
            classe: assessment.classe,
        });
        return assessment;
    }

    function calculateAssessmentScore(assessment, answers = {}) {
        const total = assessment.questions.length;
        if (!total) return { score: 0, correct: 0, total: 0 };
        const correct = assessment.questions.filter((question) => Number(answers[question.id]) === question.correctIndex).length;
        return { score: Math.round((correct / total) * 100), correct, total };
    }

    function saveAssessmentResponse(assessmentId, studentEmail, answers, options = {}) {
        const state = readState();
        const assessment = state.provincialAssessments.find((item) => item.id === assessmentId);
        if (!assessment) return { ok: false, message: "Avaliacao nao encontrada." };

        const student = getStudentByEmail(studentEmail, state);
        if (!student) return { ok: false, message: "Aluno nao encontrado." };

        const result = calculateAssessmentScore(assessment, answers);
        const response = {
            id: options.id || createId("response"),
            assessmentId,
            studentEmail,
            schoolId: student.schoolId,
            answers,
            score: result.score,
            correct: result.correct,
            total: result.total,
            synced: Boolean(options.synced),
            submittedAt: options.submittedAt || new Date().toISOString(),
            source: options.source || "local",
        };

        const index = assessment.responses.findIndex((item) => item.studentEmail === studentEmail);
        if (index >= 0) assessment.responses[index] = { ...assessment.responses[index], ...response };
        else assessment.responses.push(response);

        writeState(state);
        trackEvent("assessment.response.saved", {
            assessmentId,
            studentEmail,
            schoolId: student.schoolId,
            score: result.score,
            synced: response.synced,
        });
        return { ok: true, response };
    }

    function getStudentAssessments(studentEmail, state = readState()) {
        const student = getStudentByEmail(studentEmail, state);
        if (!student) return [];
        return state.provincialAssessments
            .filter((assessment) => assessment.classe === student.classe && assessment.schoolIds.includes(student.schoolId))
            .map((assessment) => ({
                ...assessment,
                response: assessment.responses.find((response) => response.studentEmail === studentEmail) || null,
            }));
    }

    function getProvincialDashboard(state = readState()) {
        const management = getManagementDashboard(state);
        const schoolPerformance = state.schools.map((school) => {
            const students = state.students.filter((student) => student.schoolId === school.id);
            const metrics = students.map((student) => calculateStudentMetrics(student.email, state));
            const averageProgress = metrics.length ? Math.round(metrics.reduce((sum, item) => sum + item.progresso, 0) / metrics.length) : 0;
            const assessmentResponses = state.provincialAssessments.flatMap((assessment) =>
                assessment.responses.filter((response) => response.schoolId === school.id)
            );
            const assessmentAverage = assessmentResponses.length
                ? Math.round(assessmentResponses.reduce((sum, response) => sum + response.score, 0) / assessmentResponses.length)
                : 0;
            return {
                ...school,
                totalStudents: students.length,
                totalTeachers: state.teachers.filter((teacher) => teacher.schoolId === school.id).length,
                averageProgress,
                assessmentAverage,
                riskLevel: averageProgress < 50 || (assessmentResponses.length && assessmentAverage < 50) ? "alto" : "controlado",
            };
        });

        const coverage = state.curriculum.map((item) => {
            const matchingLessons = state.teachers.flatMap((teacher) =>
                teacher.lessons.filter((lesson) =>
                    teacher.disciplina === item.disciplina &&
                    lesson.audienceClass === item.classe &&
                    lesson.title.toLowerCase().includes(item.topico.toLowerCase().split(" ")[0])
                )
            );
            const matchingAssessment = state.provincialAssessments.find((assessment) =>
                assessment.classe === item.classe &&
                assessment.disciplina === item.disciplina &&
                assessment.topic === item.topico
            );
            const responses = matchingAssessment?.responses || [];
            const mastery = responses.length ? Math.round(responses.reduce((sum, response) => sum + response.score, 0) / responses.length) : 0;
            return {
                ...item,
                lessonsLogged: matchingLessons.length,
                assessmentId: matchingAssessment?.id || null,
                mastery,
                status: matchingLessons.length && mastery >= item.masteryTarget ? "em dia" : "atencao",
            };
        });

        const alerts = [
            ...schoolPerformance
                .filter((school) => school.riskLevel === "alto")
                .map((school) => ({
                    type: "school-risk",
                    title: `${school.nome} abaixo da media`,
                    message: `Progresso medio ${school.averageProgress}% e media provincial ${school.assessmentAverage}%.`,
                })),
            ...coverage
                .filter((item) => item.status === "atencao")
                .map((item) => ({
                    type: "curriculum-delay",
                    title: `${item.disciplina} - ${item.classe}`,
                    message: `${item.topico} precisa de verificacao curricular.`,
                })),
        ].slice(0, 6);

        return {
            ...management,
            province: state.province,
            schools: schoolPerformance,
            curriculumCoverage: coverage,
            provincialAssessments: state.provincialAssessments,
            alerts,
        };
    }

    function getTeacherDashboard(teacherEmail, filters = {}, state = readState()) {
        const teacher = getTeacherByEmail(teacherEmail, state);
        if (!teacher) return null;
        const selectedClass = filters.selectedClass || "Todas";
        const selectedTurma = filters.selectedTurma || "Todas";

        const filteredLessons = teacher.lessons.filter((lesson) => audienceMatchesFilter(lesson, selectedClass, selectedTurma));
        const filteredAssignments = teacher.assignments.filter((assignment) => audienceMatchesFilter(assignment, selectedClass, selectedTurma));

        const eligibleStudents = state.students.filter((student) =>
            studentHasTeacher(student, teacher) &&
            (selectedClass === "Todas" || student.classe === selectedClass) &&
            (selectedTurma === "Todas" || student.turma === selectedTurma)
        );
        const eligibleStudentEmails = new Set(eligibleStudents.map((student) => student.email));

        const submissions = filteredAssignments.flatMap((assignment) =>
            assignment.submissions
                .filter((submission) => eligibleStudentEmails.has(submission.studentEmail))
                .map((submission) => ({
                    ...submission,
                    assignmentTitle: assignment.title,
                    student: getStudentByEmail(submission.studentEmail, state),
                    avatar: getUserByEmail(submission.studentEmail, state)?.avatar || "",
                }))
        );

        const students = eligibleStudents
            .map((student) => {
                const studentLessons = filteredLessons.filter((lesson) => audienceMatchesStudent(lesson, student));
                const studentAssignments = filteredAssignments.filter((assignment) => audienceMatchesStudent(assignment, student));
                const viewedLessons = studentLessons.filter((lesson) => lesson.watchedBy.includes(student.email)).length;
                const studentSubmissions = studentAssignments
                    .map((assignment) => assignment.submissions.find((submission) => submission.studentEmail === student.email))
                    .filter(Boolean);
                const latestScore = studentSubmissions
                    .map((submission) => submission.score)
                    .filter((score) => typeof score === "number")
                    .pop();
                const participation = studentLessons.length ? Math.round((viewedLessons / studentLessons.length) * 100) : 0;
                const entregaRate = studentAssignments.length ? Math.round((studentSubmissions.length / studentAssignments.length) * 100) : 0;

                return {
                    nome: student.nome,
                    email: student.email,
                    avatar: getUserByEmail(student.email, state)?.avatar || "",
                    classe: student.classe,
                    turma: student.turma,
                    perfil: getTrackDetails(student.perfil).label,
                    viewedLessons,
                    totalLessons: studentLessons.length,
                    submittedCount: studentSubmissions.length,
                    totalAssignments: studentAssignments.length,
                    latestScore: typeof latestScore === "number" ? latestScore : null,
                    participation,
                    entregaRate,
                };
            })
            .filter((student) => student.totalLessons > 0 || student.totalAssignments > 0);

        return {
            teacher,
            teacherUser: getUserByEmail(teacherEmail, state),
            students,
            submissions,
            lessons: filteredLessons,
            assignments: filteredAssignments,
            selectedClass,
            selectedTurma,
            totalViews: filteredLessons.reduce((sum, lesson) => sum + lesson.watchedBy.length, 0),
        };
    }

    function getManagementDashboard(state = readState()) {
        const studentPerformance = state.students.map((student) => ({
            nome: student.nome,
            avatar: getUserByEmail(student.email, state)?.avatar || "",
            classe: student.classe,
            turma: student.turma,
            perfil: getTrackDetails(student.perfil).label,
            ...calculateStudentMetrics(student.email, state),
        }));

        const turmaMap = {};
        const classeMap = {};
        const profileMap = {};

        studentPerformance.forEach((student) => {
            const turmaKey = `${student.classe} - Turma ${student.turma}`;
            if (!turmaMap[turmaKey]) {
                turmaMap[turmaKey] = { label: turmaKey, total: 0, progressSum: 0, mediaSum: 0 };
            }
            turmaMap[turmaKey].total += 1;
            turmaMap[turmaKey].progressSum += student.progresso;
            turmaMap[turmaKey].mediaSum += student.media;

            if (!classeMap[student.classe]) {
                classeMap[student.classe] = { label: student.classe, total: 0, progressSum: 0 };
            }
            classeMap[student.classe].total += 1;
            classeMap[student.classe].progressSum += student.progresso;

            profileMap[student.perfil] = (profileMap[student.perfil] || 0) + 1;
        });

        const turmaPerformance = Object.values(turmaMap).map((item) => ({
            label: item.label,
            mediaProgresso: item.total ? Math.round(item.progressSum / item.total) : 0,
            mediaNotas: item.total ? Number((item.mediaSum / item.total).toFixed(1)) : 0,
            total: item.total,
        }));

        const classePerformance = Object.values(classeMap).map((item) => ({
            label: item.label,
            mediaProgresso: item.total ? Math.round(item.progressSum / item.total) : 0,
            total: item.total,
        }));

        const profileDistribution = Object.entries(profileMap).map(([label, total]) => ({
            label,
            total,
            percent: Math.round((total / state.students.length) * 100),
        }));

        return {
            totalStudents: state.students.length,
            totalTeachers: state.teachers.length,
            totalClasses: [...new Set(state.students.map((student) => student.classe))].length,
            totalTurmas: [...new Set(state.students.map((student) => `${student.classe}-${student.turma}`))].length,
            studentPerformance,
            turmaPerformance,
            classePerformance,
            profileDistribution,
            topStudents: [...studentPerformance].sort((a, b) => b.progresso - a.progresso).slice(0, 5),
            teachers: state.teachers.map((teacher) => ({
                ...teacher,
                avatar: getUserByEmail(teacher.email, state)?.avatar || "",
            })),
        };
    }

    function seed() {
        readState();
    }

    return {
        seed,
        login,
        logout,
        registerUser,
        routeForRole,
        requireRole,
        getCurrentUser,
        getUserByEmail,
        getTrackDetails,
        getStudentByEmail,
        getTeacherByEmail,
        getStudentLessons,
        getStudentAssignments,
        calculateStudentMetrics,
        markLessonViewed,
        submitAssignment,
        addLesson,
        addAssignment,
        updateAvatar,
        updateStudentProfile,
        updateTeacherProfile,
        updateManagementProfile,
        trackEvent,
        saveDashboardSnapshot,
        getAIConfig,
        getSchoolById,
        addSchool,
        createProvincialAssessment,
        saveAssessmentResponse,
        getStudentAssessments,
        getProvincialDashboard,
        getTeacherDashboard,
        getManagementDashboard,
    };
})();

window.OkwetuData = OkwetuData;
window.OkwetuData.seed();
