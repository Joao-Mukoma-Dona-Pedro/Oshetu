(function () {
    function skeleton() {
        return `<div class="empty-state">A carregar dados...</div>`;
    }

    function setLoading(target) {
        if (target) target.innerHTML = skeleton();
    }

    window.OshetuLoading = { skeleton, setLoading };
})();
