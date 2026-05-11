(function () {
    const current = document.currentScript?.getAttribute("src") || "../js/gestao.js";
    const target = current.replace(/gestao\.js(?:\?.*)?$/, "dashboard/gestao-dashboard.js");
    if (document.readyState === "loading") {
        document.write(`<script src="${target}"><\/script>`);
    } else {
        const script = document.createElement("script");
        script.src = target;
        document.head.appendChild(script);
    }
})();
