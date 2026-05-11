(function () {
    const current = document.currentScript?.getAttribute("src") || "../js/professor.js";
    const target = current.replace(/professor\.js(?:\?.*)?$/, "dashboard/professor-dashboard.js");
    if (document.readyState === "loading") {
        document.write(`<script src="${target}"><\/script>`);
    } else {
        const script = document.createElement("script");
        script.src = target;
        document.head.appendChild(script);
    }
})();
