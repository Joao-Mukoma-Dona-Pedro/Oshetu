(function () {
    const current = document.currentScript?.getAttribute("src") || "../js/auth.js";
    const target = current.replace(/auth\.js(?:\?.*)?$/, "services/auth-ui.js");

    if (document.readyState === "loading") {
        document.write(`<script src="${target}"><\/script>`);
        return;
    }

    const script = document.createElement("script");
    script.src = target;
    document.head.appendChild(script);
})();
