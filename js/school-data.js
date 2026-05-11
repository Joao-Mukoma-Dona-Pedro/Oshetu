(function () {
    if (window.OkwetuData) return;

    const current = document.currentScript?.getAttribute("src") || "../js/school-data.js";
    const target = current.replace(/school-data\.js(?:\?.*)?$/, "data/school-data.js");

    if (document.readyState === "loading") {
        document.write(`<script src="${target}"><\/script>`);
        return;
    }

    const script = document.createElement("script");
    script.src = target;
    document.head.appendChild(script);
})();
