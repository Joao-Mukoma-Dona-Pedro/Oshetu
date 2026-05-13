(function () {
    const QUEUE_KEY = "oshetu-offline-assessment-queue";

    function readQueue() {
        try {
            return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
        } catch (error) {
            console.warn("[OshetuOfflineSync] Fila local invalida.", error);
            return [];
        }
    }

    function writeQueue(queue) {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
        return queue;
    }

    function queueAssessmentResponse(payload) {
        const queue = readQueue();
        const queued = {
            id: payload.id || `queued-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            type: "assessment-response",
            payload,
            attempts: 0,
            createdAt: new Date().toISOString(),
        };
        queue.push(queued);
        writeQueue(queue);
        return queued;
    }

    async function persistAssessmentResponse(payload) {
        const localResult = window.OkwetuData?.saveAssessmentResponse?.(
            payload.assessmentId,
            payload.studentEmail,
            payload.answers,
            { id: payload.responseId, source: "offline-first", synced: false }
        );

        const firestoreResult = await window.OshetuDatabaseService?.saveAssessmentResponse?.({
            ...payload,
            response: localResult?.response,
        });

        if (!firestoreResult?.ok) {
            queueAssessmentResponse({ ...payload, responseId: localResult?.response?.id });
            return { ok: true, queued: true, response: localResult?.response };
        }

        window.OkwetuData?.saveAssessmentResponse?.(
            payload.assessmentId,
            payload.studentEmail,
            payload.answers,
            { id: localResult?.response?.id, source: "firebase", synced: true }
        );
        return { ok: true, queued: false, response: localResult?.response };
    }

    async function flush() {
        const queue = readQueue();
        if (!queue.length) return { ok: true, flushed: 0 };

        const remaining = [];
        let flushed = 0;
        for (const item of queue) {
            try {
                const result = await window.OshetuDatabaseService?.saveAssessmentResponse?.(item.payload);
                if (result?.ok) {
                    window.OkwetuData?.saveAssessmentResponse?.(
                        item.payload.assessmentId,
                        item.payload.studentEmail,
                        item.payload.answers,
                        { id: item.payload.responseId, source: "firebase", synced: true }
                    );
                    flushed += 1;
                } else {
                    remaining.push({ ...item, attempts: item.attempts + 1 });
                }
            } catch (error) {
                remaining.push({ ...item, attempts: item.attempts + 1, lastError: error.message });
            }
        }

        writeQueue(remaining);
        return { ok: true, flushed, remaining: remaining.length };
    }

    window.addEventListener("online", () => {
        flush();
    });

    window.OshetuOfflineSyncService = {
        readQueue,
        queueAssessmentResponse,
        persistAssessmentResponse,
        flush,
    };
})();
