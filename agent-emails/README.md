# Agent emails marketing — mise en place (livrable 3.2)

Agent IA qui rédige des emails marketing personnalisés dans la voix de « L'Or & la Cendre ».

```
Formulaire de campagne ──► Agent rédacteur (Gemini) ──► Page « Votre email est prêt »
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `prompt-agent-emails.md` | Source de vérité du system prompt. |
| `n8n-workflow-emails.json` | Workflow importable dans n8n (prompt déjà intégré). |

## Étapes

1. Dans n8n : **Workflows → Import from File** → `n8n-workflow-emails.json`.
2. Ouvrir le nœud **Google Gemini Chat Model** → sélectionner **le même credential Gemini** que ton chatbot (pas besoin d'en recréer un).
   Vérifier que le modèle est un modèle **stable** (ex. `models/gemini-2.5-flash`), pas un modèle *preview*.
3. **Publish** le workflow.
4. Ouvrir le nœud **Formulaire de campagne** → copier l'**URL du formulaire (Production URL)**.
5. Ouvrir cette URL dans le navigateur, remplir la campagne, valider → l'email généré s'affiche.

## Exemple de test

- Type de campagne : *Lancement de collection*
- Univers : *Montres*
- Segment : *Membre du Cercle Privé*
- Prénom : *Alexandre*
- Précisions : *Présentation en avant-première de la collection Souveraine*

## Points d'attention

- **Réutilise le credential Gemini existant** : inutile d'en créer un second.
- Si le nœud **Email généré** (Form completion) pose souci à l'import (version différente),
  supprime-le : l'email reste visible dans **Executions**. On pourra le rebrancher ensuite.
- **Prochaine étape possible** : ajouter un nœud **Gmail** pour envoyer réellement l'email de test
  (transforme le générateur en agent d'envoi de bout en bout).
