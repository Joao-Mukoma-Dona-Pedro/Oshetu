(function () {
    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function metricCard({ label, value, detail = "" }) {
        return `
            <article class="metric-card">
                <strong>${escapeHtml(value)}</strong>
                <span>${escapeHtml(label)}</span>
                ${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
            </article>
        `;
    }

    function insightCard({ title, summary, actions = [] }) {
        return `
            <article class="profile-card ai-insight-card">
                <span class="eyebrow">IA futura</span>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(summary)}</p>
                ${actions.length ? `<ul>${actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
            </article>
        `;
    }

    function emptyState(message) {
        return `<div class="empty-state">${escapeHtml(message)}</div>`;
    }

    window.OshetuCards = { escapeHtml, metricCard, insightCard, emptyState };
})();
