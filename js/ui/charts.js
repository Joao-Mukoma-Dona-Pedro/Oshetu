(function () {
    function barRows(items = []) {
        return items.map((item) => `
            <div class="progress-row teacher-bar">
                <div class="row-title">
                    <span>${window.OshetuCards?.escapeHtml(item.label) || item.label}</span>
                    <strong>${item.value}%</strong>
                </div>
                <div class="progress-track"><span style="width:${item.value}%"></span></div>
            </div>
        `).join("");
    }

    window.OshetuCharts = { barRows };
})();
