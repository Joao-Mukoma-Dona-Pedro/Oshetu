(function () {
    function clamp(value, min = 0, max = 100) {
        return Math.min(max, Math.max(min, Number(value) || 0));
    }

    function percent(value) {
        return `${Math.round(clamp(value))}%`;
    }

    function score(value, max = 20) {
        return typeof value === "number" ? `${value}/${max}` : "Sem nota";
    }

    function firstName(name = "") {
        return String(name).trim().split(/\s+/)[0] || "Utilizador";
    }

    function greeting(date = new Date()) {
        const hour = date.getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    }

    window.OshetuFormatters = { clamp, percent, score, firstName, greeting };
})();
