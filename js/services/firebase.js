(function () {
    const COLLECTIONS = [
        "users",
        "students",
        "teachers",
        "management",
        "classes",
        "turmas",
        "assignments",
        "lessons",
        "analytics",
        "notifications",
        "aiInsights",
        "recommendations",
        "performanceAnalysis",
    ];

    let app = null;
    let auth = null;
    let db = null;
    let storage = null;

    function config() {
        return window.OSHETU_FIREBASE_CONFIG || window.OshetuFirebaseConfig || null;
    }

    function sdk() {
        return window.firebase || null;
    }

    function initialize(customConfig = config()) {
        const firebase = sdk();
        if (!firebase) return { ok: false, reason: "firebase-sdk-missing" };
        if (!customConfig?.apiKey || !customConfig?.projectId) return { ok: false, reason: "firebase-config-missing" };

        if (!app) app = firebase.apps?.length ? firebase.app() : firebase.initializeApp(customConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        return { ok: true, app, auth, db, storage };
    }

    function services() {
        if (!app) initialize();
        return { app, auth, db, storage };
    }

    function serverTimestamp() {
        const firebase = sdk();
        return firebase?.firestore?.FieldValue?.serverTimestamp
            ? firebase.firestore.FieldValue.serverTimestamp()
            : new Date().toISOString();
    }

    function status() {
        return {
            initialized: Boolean(app),
            sdkLoaded: Boolean(sdk()),
            configured: Boolean(config()?.apiKey),
            collections: [...COLLECTIONS],
            plan: "Spark gratuito",
        };
    }

    window.OshetuFirebase = { COLLECTIONS, initialize, services, serverTimestamp, status };
})();
