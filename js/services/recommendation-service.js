(function () {
    function studentNextSteps(student = {}) {
        return [
            { title: "Continue estudando", detail: `Mantem o foco em ${student.classe || "tua classe"}.` },
            { title: "Meta semanal", detail: "Completa pelo menos uma aula e uma tarefa." },
        ];
    }

    window.OshetuRecommendationService = { studentNextSteps };
})();
