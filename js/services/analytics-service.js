(function () {
    function track(name, payload = {}) {
        const event = { name, payload, createdAt: new Date().toISOString() };
        window.OshetuStorage?.append?.("analytics-events", event);
        window.OshetuDatabaseService?.trackAnalytics?.(name, payload);
        return event;
    }

    function studentSignals(studentEmail) {
        const metrics = window.OkwetuData?.calculateStudentMetrics?.(studentEmail) || {};
        return {
            progress: metrics.progresso || 0,
            average: metrics.media || 0,
            watchedLessons: metrics.aulasAssistidas || 0,
            deliveredTasks: metrics.entregas || 0,
        };
    }

    window.OshetuAnalyticsService = { track, studentSignals };
})();
