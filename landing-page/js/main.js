/* ==========================================================================
   L'Or & la Cendre — landing page behaviour
   ========================================================================== */
(function () {
  "use strict";

  /* --------------------------------------------------------------------
   * Configuration : renseignez ici l'URL de votre webhook n8n.
   * Le formulaire enverra un POST JSON : { name, email, source, submittedAt }
   * Tant que cette valeur est vide, la soumission est simulée localement
   * (utile pour tester le design avant de brancher le workflow n8n).
   * ------------------------------------------------------------------ */
  const N8N_WEBHOOK_URL = "https://nidmhan.app.n8n.cloud/webhook/lor-et-la-cendre-leads";

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  const closeNav = () => {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("active"));
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Lead capture form ---------------- */
  const form = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");
  const formNote = document.getElementById("formNote");

  const setNote = (message, isError) => {
    formNote.textContent = message;
    formNote.classList.toggle("error", Boolean(isError));
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const honeypot = form.company.value.trim();

    // Honeypot rempli : trafic probablement automatisé, on ignore silencieusement.
    if (honeypot) return;

    if (!fullName) {
      setNote("Merci d'indiquer votre nom.", true);
      form.fullName.focus();
      return;
    }
    if (!isValidEmail(email)) {
      setNote("Merci d'indiquer une adresse email valide.", true);
      form.email.focus();
      return;
    }

    const payload = {
      name: fullName,
      email: email,
      source: "landing-page-lor-et-la-cendre",
      submittedAt: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    const originalLabel = submitBtn.querySelector(".btn-label").textContent;
    submitBtn.querySelector(".btn-label").textContent = "Envoi en cours...";
    setNote("", false);

    try {
      if (N8N_WEBHOOK_URL) {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Réponse serveur invalide");
      } else {
        // Pas de webhook configuré : on simule l'envoi pour la démonstration.
        console.info("[L'Or & la Cendre] N8N_WEBHOOK_URL non configurée — payload prêt :", payload);
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      form.reset();
      setNote("Merci, " + fullName.split(" ")[0] + ". Votre demande a bien été transmise.", false);
    } catch (error) {
      console.error("[L'Or & la Cendre] Échec de l'envoi du formulaire :", error);
      setNote("Une erreur est survenue. Merci de réessayer dans un instant.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-label").textContent = originalLabel;
    }
  });
})();
