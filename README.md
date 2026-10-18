# Maurice.Dev — Frontend

Portfolio professionnel de **Maurice Togo**, développeur Full Stack. Cette application présente mon profil, mes compétences techniques et mes réalisations à travers une interface moderne développée avec Angular.

## Aperçu du projet

Maurice.Dev est un portfolio web conçu pour présenter mon parcours et centraliser mes projets dans une interface soignée et responsive.

### Fonctionnalités

- **Page d'accueil** — présentation du développeur et de son profil.
- **Projets** — présentation des réalisations et des technologies utilisées.
- **Compétences** — aperçu des technologies maîtrisées.
- **Expériences et formations** — parcours académique et professionnel.
- **Contact** — interface permettant aux visiteurs d'envoyer un message.
- **Espace administrateur** — interface de connexion pour gérer les contenus du portfolio.
- **API REST** — récupération des données depuis le backend Spring Boot.

## Technologies utilisées

- Angular
- TypeScript
- HTML5 et CSS3
- RxJS
- Angular Router
- Angular Forms et HttpClient
- Spring Boot REST API — backend associé

## Prérequis

Avant de lancer le projet, installez :

- Node.js et npm
- Angular CLI, si nécessaire
- Le backend Spring Boot pour les fonctionnalités connectées à l'API

## Installation

Clonez le dépôt :

```bash
git clone <URL_DU_DEPOT_FRONTEND>
cd portfolio-frontend
```

Installez les dépendances :

```bash
npm install
```

Démarrez le serveur de développement :

```bash
npm start
```

Si la commande `npm start` n'est pas définie dans `package.json`, utilisez :

```bash
npx ng serve
```

Ouvrez ensuite :

http://localhost:4200

## Configuration de l'API

En développement, le frontend communique avec le backend Spring Boot à l'adresse :

```text
http://localhost:8080/api
```

Le service d'authentification utilise actuellement :

```text
http://localhost:8080/api/auth
```

Adaptez ces URL à l'environnement de déploiement avant de publier l'application en production. Ne placez aucun mot de passe, jeton privé ou secret dans le code frontend.

## Structure du projet

```text
src/
├── app/
│   ├── admin/          # Interface d'administration
│   ├── services/       # Communication avec l'API
│   ├── app.config.ts   # Configuration Angular
│   └── ...
├── environments/       # Configuration des environnements
├── assets/             # Ressources statiques, si utilisées
└── styles.css          # Styles globaux, si présent
```

La structure exacte peut évoluer avec les prochaines versions du projet.

## Build de production

Pour générer les fichiers de production :

```bash
npx ng build
```

Les fichiers générés se trouvent dans le dossier `dist/`. Le contenu de ce dossier peut ensuite être déployé sur un hébergeur web compatible avec les applications Angular statiques.

## Déploiement

Le frontend peut être hébergé sur une plateforme prenant en charge les applications Angular, par exemple Vercel ou