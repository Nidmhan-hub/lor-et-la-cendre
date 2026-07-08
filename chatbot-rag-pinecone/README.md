# Chatbot RAG avec vector store — V2 (Pinecone)

Version **conforme au barème** du chatbot (3.1) : vrai RAG avec **embeddings + base vectorielle Pinecone**.
À conserver **en parallèle** de la V1 (`../chatbot/`, injection de contexte) pour les comparer.

```
INGESTION (une fois) :
base-connaissances.md ──► Découpage ──► Embeddings Gemini ──► Pinecone

REQUÊTE (à chaque message) :
Chat Trigger ──► AI Agent ──► réponse
                   ├── Google Gemini (LLM)
                   ├── Mémoire
                   └── outil « base_connaissances » ──► Pinecone (recherche par similarité)
                                                          └── Embeddings Gemini
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `n8n-ingestion-pinecone.json` | Remplit l'index Pinecone depuis la base de connaissances. À lancer **une fois**. |
| `n8n-chatbot-rag-pinecone.json` | Le chatbot qui interroge Pinecone à chaque question. |

---

## Étape 1 — Compte et index Pinecone (toi)

1. Crée un compte gratuit sur [pinecone.io](https://www.pinecone.io) (connexion Google possible).
2. **Create Index** :
   - **Name** : `lor-et-la-cendre`
   - **Dimensions** : **`768`**  ⬅️ *impératif* (correspond au modèle d'embeddings `text-embedding-004`)
   - **Metric** : `cosine`
   - Laisse le reste par défaut (serverless, région proposée).
3. Récupère ta **clé API** (section *API Keys*). Tu la mettras dans n8n, jamais ailleurs.

> ⚠️ Si les dimensions ≠ 768, l'insertion échouera. C'est l'erreur n°1 à éviter.

## Étape 2 — Importer et brancher les credentials (n8n)

1. Importe **les deux** fichiers `.json` (Workflows → Import from File).
2. Dans chaque nœud **Pinecone** → crée le credential *PineconeApi* avec ta clé → sélectionne l'index `lor-et-la-cendre`.
3. Dans chaque nœud **Embeddings Gemini** et **Google Gemini Chat Model** → sélectionne **le credential Gemini existant** (le même que la V1).

## Étape 3 — Lancer l'ingestion (une fois)

1. Ouvre le workflow **Ingestion Pinecone** → clique **Test workflow** (bouton d'exécution manuelle).
2. Vérifie dans Pinecone que l'index contient maintenant des vecteurs (compteur *Record count* > 0).
3. À refaire uniquement si tu modifies `base-connaissances.md`.

## Étape 4 — Activer le chatbot RAG

1. Ouvre le workflow **Conseiller virtuel RAG (V2)** → **Publish**.
2. Ouvre le nœud **Chat Trigger** → copie l'**URL de production (Chat URL)**.
3. Teste dans *Open chat* : « Combien coûte une montre Méridien ? » → il doit **interroger Pinecone** puis répondre « dès 8 900 € ».

## Basculer le site sur la V2 (optionnel)

Dans `../landing-page/js/chat.js`, remplace la valeur de `N8N_CHAT_WEBHOOK_URL` par l'URL de la V2.
Pour revenir à la V1, remets l'ancienne URL. (Une seule ligne à changer.)

## Différence V1 / V2 (pour la soutenance)

| | V1 (`../chatbot/`) | V2 (ici) |
|---|---|---|
| Savoir donné au LLM | toute la base, à chaque fois | seulement les extraits pertinents, retrouvés par similarité |
| Embeddings / vector store | non | **oui (Pinecone)** |
| Conforme au barème | partiellement | **oui** |
| Idéal quand | petite base | base volumineuse |
