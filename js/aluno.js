(function () {
    const current = document.currentScript?.getAttribute("src") || "../js/aluno.js";
    const target = current.replace(/aluno\.js(?:\?.*)?$/, "dashboard/aluno-dashboard.js");
    if (document.readyState === "loading") {
        document.write(`<script src="${target}"><\/script>`);
    } else {
        const script = document.createElement("script");
        script.src = target;
        document.head.appendChild(script);
    }
})();
