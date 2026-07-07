# Scoring des leads — mise en place (livrable 3.3)

Workflow déclenché par le formulaire **"Rejoindre le Cercle Privé"** de la landing page.
Chaque lead est scoré puis **ajouté dans Google Sheets** (API) avant confirmation au visiteur.

```
Webhook (nom, email) ──► Calcul du score (règles) ──► Google Sheets (append) ──► Réponse JSON
```

## Compte Google à utiliser

Utilise le compte Google de ton choix pour la feuille (idéalement dédié au projet, pas forcément
ton compte personnel) — il doit juste être le **même compte** que celui connecté au credential
Google Sheets dans n8n. Aucun lien avec le compte utilisé pour Gemini.

## Créer la feuille (à faire une fois, à la main)

1. Connecte-toi au compte Google choisi → [sheets.google.com](https://sheets.google.com) → **Feuille vierge**.
2. Renomme-la par exemple *"L'Or & la Cendre — Leads"*.
3. Sur la **ligne 1**, colle exactement ces en-têtes (un par cellule, dans cet ordre) :

   ```
   name	email	domain	score	tier	reasons	source	submittedAt	scoredAt
   ```

   Ces noms doivent correspondre **exactement** (respecter la casse) aux champs calculés par le
   workflow — c'est ce qui permet le mapping automatique dans n8n, sans configuration manuelle.

## Règles de scoring (MVP)

| Signal | Règle | Points |
|---|---|---|
| Domaine email | Pas une adresse grand public (gmail, yahoo, hotmail…) | +2 |
| Nom complet | Nom **et** prénom renseignés | +1 |

- Score ≥ 2 → **prioritaire**
- Score < 2 → **standard**

## Étapes n8n

1. **Workflows → Import from File** → `n8n-workflow-leads.json`.
2. Ouvrir le nœud **Ajout dans Google Sheets** :
   - Credential → **Create new** → se connecter avec **le compte Google choisi ci-dessus**.
   - Champ **Document** → sélectionner *"L'Or & la Cendre — Leads"* dans la liste (picker).
   - Champ **Sheet** → sélectionner l'onglet (généralement *Sheet1* / *Feuille 1*).
   - Le mapping des colonnes se fait tout seul (mode automatique) grâce aux en-têtes identiques.
3. **Publish** le workflow.
4. Ouvrir le nœud **Webhook Cercle Privé** → copier l'**URL de production**.
5. Coller cette URL dans [`landing-page/js/main.js`](../landing-page/js/main.js), constante `N8N_WEBHOOK_URL` (ligne 13).
6. Recharger la landing page, remplir le formulaire "Rejoindre le Cercle Privé", valider.
7. Vérifier : la ligne apparaît dans **Google Sheets**, et l'exécution dans **Executions** (n8n).

## Test rapide sans passer par le formulaire

```
POST https://<ton-instance>.app.n8n.cloud/webhook/lor-et-la-cendre-leads
Content-Type: application/json

{ "name": "Alexandre Dupont", "email": "alexandre@cabinet-conseil.fr" }
```
→ devrait renvoyer `{ "success": true, "tier": "prioritaire", "score": 3 }`

## Itération suivante (pas encore fait)

- Notification (email/Slack) automatique si `tier = "prioritaire"`
- Enrichir le formulaire (ex. "univers qui vous intéresse") pour un scoring plus fin
- Enchaîner vers le workflow de nurturing email (option B) pour les leads prioritaires
