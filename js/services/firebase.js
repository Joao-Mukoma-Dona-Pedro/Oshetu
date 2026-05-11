(function () {
    const COLLECTIONS = [
        "users",
        "students",
        "teachers",
        "management",
        "analytics",
        "notifications",
        "aiInsights",
        "classes",
        "turmas",
        "assignments",
        "lessons",
    ];

    let app = null;
    let auth = null;
    let db = null;
    let storage = null;
    let initResult = null;

    function getConfig() {
        return window.OSHETU_FIREBASE_CONFIG || window.OshetuFirebaseConfig || null;
    }

    function getSdk() {
        return window.firebase || null;
    }

    function initialize(customConfig = getConfig()) {
        const firebase = getSdk();

        if (!firebase) {
            initResult = { ok: false, reason: "firebase-sdk-missing" };
            return initResult;
        }

        if (!customConfig?.apiKey || !customConfig?.projectId || !customConfig?.authDomain) {
            initResult = { ok: false, reason: "firebase-config-missing" };
            return initResult;
        }

        try {
            app = app || (firebase.apps?.length ? firebase.app() : firebase.initializeApp(customConfig));
            auth = auth || firebase.auth();
            db = db || firebase.firestore();
            storage = storage || firebase.storage();

            if (auth.setPersistence) {
                const persistence = firebase.auth?.Auth?.Persistence?.LOCAL || "local";
                auth.setPersistence(persistence).catch(() => {});
            }

            if (db.enablePersistence && !window.__OSHETU_FIRESTORE_PERSISTENCE__) {
                window.__OSHETU_FIRESTORE_PERSISTENCE__ = true;
                db.enablePersistence({ synchronizeTabs: true }).catch((error) => {
                    if (!["failed-precondition", "unimplemented"].includes(error.code)) {
                        console.warn("[OshetuFirebase] Persistencia offline indisponivel.", error);
                    }
                });
            }

            initResult = { ok: true, app, auth, db, storage };
            return initResult;
        } catch (error) {
            initResult = { ok: false, reason: "firebase-init-error", error };
            console.error("[OshetuFirebase] Falha ao inicializar Firebase.", error);
            return initResult;
        }
    }

    function services() {
        if (!initResult?.ok) initialize();
        return { app, auth, db, storage };
    }

    function serverTimestamp() {
        const firebase = getSdk();
        return firebase?.firestore?.FieldValue?.serverTimestamp
            ? firebase.firestore.FieldValue.serverTimestamp()
            : new Date().toISOString();
    }

    function deleteField() {
        const firebase = getSdk();
        return firebase?.firestore?.FieldValue?.delete
            ? firebase.firestore.FieldValue.delete()
            : null;
    }

    function status() {
        return {
            initialized: Boolean(app && auth && db && storage),
            sdkLoaded: Boolean(getSdk()),
            configured: Boolean(getConfig()?.apiKey && getConfig()?.projectId),
            reason: initResult?.reason || null,
            collections: [...COLLECTIONS],
            plan: "Spark gratuito",
        };
    }

    window.OshetuFirebase = {
        COLLECTIONS,
        initialize,
        services,
        serverTimestamp,
        deleteField,
        status,
    };
})();
