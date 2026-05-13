document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("home-page")) {
        return;
    }

    const faqButtons = document.querySelectorAll(".faq-toggle");
    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const expanded = button.getAttribute("aria-expanded") === "true";
            const content = button.nextElementSibling;

            faqButtons.forEach((otherButton) => {
                otherButton.setAttribute("aria-expanded", "false");
                const otherContent = otherButton.nextElementSibling;
                if (otherContent) {
                    otherContent.style.maxHeight = "0px";
                }
            });

            if (!expanded && content) {
                button.setAttribute("aria-expanded", "true");
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    const revealElements = document.querySelectorAll(".section-reveal");
    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => revealObserver.observe(element));
});
