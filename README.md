# Foodtruck — Starter 3

Dépôt : `I321-StarterCode-3`. La branche `main` contient le starter. Ce dossier est un point de départ à compléter, pas le corrigé.
Installer Node.js **24 LTS** et Git. Le cours et les consignes restent en français.

## Démarrer

```sh
git clone https://github.com/CPNV-KMI-I321/I321-StarterCode-3.git
cd I321-StarterCode-3
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

Le monolithe de l'étape 2 fonctionne. Les deux ressources sont encore indépendantes.
Les fichiers Services et PizzaComposition sont des squelettes : ils ne sont pas encore appelés par les contrôleurs.
Leur code TODO répondra 501 une fois branché. La validation de `ingredientIds` et le contrat Swagger cible sont fournis.

1. Déplacer la logique des contrôleurs dans `src/services/pizzasService.js` et `ingredientsService.js`.
2. Faire déléguer les contrôleurs aux services ; conserver req/res dans les contrôleurs.
3. Ajouter un nom de pizza unique (index SQLite NOCASE).
4. Créer la table `pizza_ingredients` : clé primaire composée, clés étrangères et suppression en cascade côté pizza.
5. Compléter `src/entities/PizzaComposition.js` et `Pizza.findByName`.
6. Une pizza doit contenir au moins un ingrédient ; tous les identifiants doivent exister et être distincts.
7. Créer et modifier la pizza et sa composition dans une transaction SQLite synchrone : BEGIN IMMEDIATE, COMMIT ou ROLLBACK.
8. Une suppression d'ingrédient utilisé doit répondre 409 ; un nom de pizza déjà utilisé aussi.
9. Produire un MCD/MLD N à N et la séquence de création avec ses cas d'erreur.

Les services doivent aussi restituer `ingredientIds` dans les lectures de pizzas.
Créer les ingrédients avant les pizzas. Le prix reste saisi, sans calcul automatique.
Utiliser la nouvelle base `data/starter-3.sqlite` : les anciennes pizzas n'avaient pas de composition.

```json
{"name":"Margherita","price":14.5,"ingredientIds":[1]}
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
