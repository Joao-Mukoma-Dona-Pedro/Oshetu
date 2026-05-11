(function () {
    const DEFAULT_NAMESPACE = "oshetu";

    function key(name, namespace = DEFAULT_NAMESPACE) {
        return `${namespace}:${name}`;
    }

    function read(name, fallback = null, options = {}) {
        try {
            const raw = localStorage.getItem(key(name, options.namespace));
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            console.warn("[OshetuStorage] Leitura falhou.", error);
            return fallback;
        }
    }

    function write(name, value, options = {}) {
        localStorage.setItem(key(name, options.namespace), JSON.stringify(value));
        return value;
    }

    function append(name, value, options = {}) {
        const current = read(name, [], options);
        const next = Array.isArray(current) ? [...current, value] : [value];
        write(name, next, options);
        return next;
    }

    function remove(name, options = {}) {
        localStorage.removeItem(key(name, options.namespace));
    }

    window.OshetuStorage = { key, read, write, append, remove };
})();
