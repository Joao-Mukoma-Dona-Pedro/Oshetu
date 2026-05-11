(function () {
    function toast(message, type = "info") {
        const item = document.createElement("div");
        item.className = `status-message is-visible is-${type} os-toast`;
        item.textContent = message;
        document.body.appendChild(item);
        window.setTimeout(() => item.remove(), 3200);
    }

    window.OshetuNotifications = { toast };
})();
