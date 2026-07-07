# Conseiller virtuel — mise en place (n8n + Google Gemini)

Architecture : **injection de contexte** (pas d'embeddings, pas de base vectorielle).
La base de connaissances tient dans le *system prompt* de l'AI Agent.

```
Chat Trigger ──► AI Agent ──► réponse
                   ├── Google Gemini Chat Model (gratuit — Google AI Studio)
                   └── Mémoire de conversation
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `base-connaissances.md` | Source de vérité du contenu. À compléter avec les vraies infos du client. |
| `n8n-workflow.json` | Workflow importable dans n8n. Le system prompt y est déjà intégré. |
| `../landing-page/js/chat.js` | Widget de chat sur la landing page. |
| `../landing-page/css/chat.css` | Habillage or/noir du widget. |

## Étapes

1. **Prérequis** : une instance n8n (cloud ou self-hosted) et une clé API gratuite Google Gemini (aistudio.google.com → *Get API key*).
2. Dans n8n : **Workflows → Import from File** → `n8n-workflow.json`.
3. Ouvrir le nœud **Google Gemini Chat Model** → créer/sélectionner votre *credential* Google Gemini(PaLM) Api.
4. Ouvrir le nœud **Chat Trigger** → s'assurer que **"Load Previous Session"** est sur *Manually* ou *Off*
   (sinon le nœud réclame une connexion Memory directe et affiche un triangle rouge).
5. **Activer** le workflow (interrupteur en haut à droite).
6. Ouvrir le nœud **Chat Trigger** → copier l'**URL de production (Chat URL)**.
7. Coller cette URL dans `landing-page/js/chat.js`, variable `N8N_CHAT_WEBHOOK_URL`, puis recharger la page.
   Une pastille dorée apparaît en bas à droite.

## Points d'attention

- **CORS** : le workflow autorise toutes les origines (`allowedOrigins: "*"`) pour faciliter les tests.
  En production, restreindre au domaine réel du site dans le nœud Chat Trigger.
- **Deux webhooks distincts** : le formulaire « Cercle Privé » (capture de leads, voir `main.js`) et le chatbot
  utilisent deux workflows/webhooks n8n différents. Ne pas les confondre.
- **Mise à jour du contenu** : `base-connaissances.md` est la référence. Après modification, reporter le contenu
  dans le champ *System Message* du nœud AI Agent (ou l'y coller en entier).
- **Coût** : le palier gratuit de Google AI Studio est soumis à des quotas (requêtes/minute et/ou par jour).
  Largement suffisant pour une démo ou un projet étudiant ; surveiller la console si le trafic augmente.
