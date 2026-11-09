# Foodtruck — Starter 1

Dépôt : `I321-StarterCode-1`. La branche `main` contient le starter. Ce dossier est un point de départ à compléter, pas le corrigé.
Installer Node.js **24 LTS** et Git. Le cours et les consignes restent en français.

## Démarrer

```sh
git clone https://github.com/CPNV-KMI-I321/I321-StarterCode-1.git
cd I321-StarterCode-1
```

```sh
npm ci
npm start
```

API : http://localhost:3000 ; Swagger : http://localhost:3000/docs.
`npm run dev` redémarre le serveur lors des modifications.

Les routes et leur JSON attendu sont décrits dans Swagger. Les bases SQLite sont créées automatiquement.
Pour personnaliser la configuration, copier le `.env.example` de chaque application vers `.env` dans le même dossier.
Les chemins de base sont relatifs au dossier de l'application. Ne pas reprendre une base ou un `.env` d'une autre étape.

## À réaliser

`GET /api/pizzas` est un exemple complet à lire avant de commencer.
Les autres opérations répondent **501** tant qu'elles ne sont pas implémentées.

1. Compléter `findById`, `create`, `update` et `remove` dans `src/entities/Pizza.js` avec du SQL paramétré.
2. Compléter les contrôleurs correspondants dans `src/controllers/pizzasController.js`.
3. Réutiliser `validateId`, `validatePizza` et `fail` depuis `src/validation.js`.
4. Pour POST : répondre 201 avec la pizza et un en-tête Location. Pour DELETE : 204 sans corps.
5. Répondre 400 si les données sont invalides et 404 si une pizza demandée n'existe pas.
6. Produire le diagramme Client → Route → Controller → Entity → SQLite.

Ne mettre aucun SQL dans les routes ou contrôleurs, ni req/res dans les entités.
La configuration SQLite, la table pizzas, les routes, Swagger et la validation sont déjà fournis.

```json
{"name":"Margherita","description":"Classique","price":14.5}
```

## Vérifier son travail

```sh
npm test
npm run test:acceptance
```

`npm test` vérifie uniquement que le point de départ et les fonctionnalités précédemment acquises fonctionnent.
Ces tests ne valident pas la nouvelle étape.
`npm run test:acceptance` vérifie le résultat à atteindre : ses échecs sont attendus avant de terminer les TODO.
Ne pas modifier les assertions pour les faire passer. Avancer fonctionnalité par fonctionnalité et tester aussi avec Swagger.
À l'étape 5, les tests d'acceptation nécessitent Docker démarré.

Le diagramme demandé peut être produit dans `docs/a-completer.puml`.
Ce starter possède un historique indépendant du corrigé. Le corrigé sera publié par l'enseignant en fin de séance.

## Consulter le corrigé

Quand l’enseignant aura publié la branche `solution` :

```sh
git fetch origin
git switch solution
```

Conserver son travail dans des commits avant de changer de branche.
