/* ==========================================================================
   Espace équipe — générateur d'emails
   --------------------------------------------------------------------------
   Appelle le workflow n8n « Agent emails (Webhook) ».
   1. Importe agent-emails/n8n-workflow-emails-webhook.json dans n8n.
   2. Branche le credential Gemini, puis Publie le workflow.
   3. L'URL de production sera : .../webhook/lor-et-la-cendre-emails
      (déjà renseignée ci-dessous ; ajuste-la si ton chemin diffère).
   ========================================================================== */
const N8N_EMAIL_WEBHOOK_URL = "https://nidmhan.app.n8n.cloud/webhook/lor-et-la-cendre-emails";

(function () {
  "use strict";

  const form = document.getElementById("emailForm");
  const btn = document.getElementById("genBtn");
  const note = document.getElementById("emailNote");
  const resultText = document.getElementById("resultText");
  const resultEmpty = document.getElementById("resultEmpty");
  const copyBtn = document.getElementById("copyBtn");

  const setNote = (msg, isError) => {
    note.textContent = msg;
    note.classList.toggle("error", Boolean(isError));
  };

  const showResult = (text) => {
    resultEmpty.hidden = true;
    resultText.hidden = false;
    resultText.classList.remove("loading");
    resultText.textContent = text;
    copyBtn.hidden = false;
  };

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(resultText.textContent).then(() => {
      copyBtn.textContent = "Copié";
      setTimeout(() => (copyBtn.textContent = "Copier"), 1800);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!N8N_EMAIL_WEBHOOK_URL) {
      setNote("URL du webhook n8n non configurée (voir js/admin.js).", true);
      return;
    }

    const payload = {
      typeCampagne: form.typeCampagne.value,
      univers: form.univers.value,
      segment: form.segment.value,
      prenom: form.prenom.value.trim(),
      precisions: form.precisions.value.trim(),
    };

    btn.disabled = true;
    const label = btn.querySelector(".btn-label");
    const original = label.textContent;
    label.textContent = "Génération en cours…";
    setNote("", false);
    resultEmpty.hidden = true;
    resultText.hidden = false;
    resultText.classList.add("loading");
    resultText.textContent = "L'agent rédige l'email…";
    copyBtn.hidden = true;

    try {
      const res = await fetch(N8N_EMAIL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Réponse serveur " + res.status);
      const data = await res.json();
      const output = data.output || data.text || (typeof data === "string" ? data : JSON.stringify(data));
      showResult(output);
      setNote("Email généré.", false);
    } catch (err) {
      console.error("[Admin] Génération impossible :", err);
      resultText.classList.remove("loading");
      resultText.hidden = true;
      resultEmpty.hidden = false;
      setNote("Une erreur est survenue. Vérifiez que le workflow n8n est publié.", true);
    } finally {
      btn.disabled = false;
      label.textContent = original;
    }
  });
})();
