/* ==========================================================================
   Conseiller virtuel — widget de chat n8n
   --------------------------------------------------------------------------
   1. Importez le workflow chatbot/n8n-workflow.json dans n8n.
   2. Ouvrez le nœud « Chat Trigger », copiez son URL de production (« Chat URL »).
   3. Collez cette URL ci-dessous, puis rechargez la page.
   Tant que la valeur est vide, le widget ne se charge pas (utile pour le design).
   ========================================================================== */
const N8N_CHAT_WEBHOOK_URL = "https://nidmhan.app.n8n.cloud/webhook/lor-et-la-cendre-chat/chat";

if (N8N_CHAT_WEBHOOK_URL) {
  // Feuille de style officielle du widget n8n (CDN)
  const baseStyles = document.createElement("link");
  baseStyles.rel = "stylesheet";
  baseStyles.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
  document.head.appendChild(baseStyles);

  // Habillage maison (chargé après, pour surcharger le thème par défaut)
  const themeStyles = document.createElement("link");
  themeStyles.rel = "stylesheet";
  themeStyles.href = "css/chat.css";
  document.head.appendChild(themeStyles);

  import("https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js")
    .then(({ createChat }) => {
      createChat({
        webhookUrl: N8N_CHAT_WEBHOOK_URL,
        mode: "window",
        showWelcomeScreen: false,
        initialMessages: [
          "Bonjour. Je suis votre conseiller privé.",
          "Comment puis-je vous accompagner ?",
        ],
        i18n: {
          en: {
            title: "L'Or & la Cendre",
            subtitle: "Votre conseiller privé",
            inputPlaceholder: "Posez votre question…",
            getStarted: "Nouvelle conversation",
            footer: "",
            closeButtonTooltip: "Fermer",
          },
        },
      });
    })
    .catch((err) => console.error("[Chat] Chargement du widget impossible :", err));
}
