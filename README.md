# 📋 Rapport des Ateliers DevOps — Frejus Adedemi

**GitHub du projet :** [FrejusAdedemi/API-calculatrice](https://github.com/FrejusAdedemi/API-calculatrice)

---

## Atelier 1 — Docker & Docker Compose + Mini-projet API Calculatrice

### Description
Mise en place d'une application web conteneurisée composée d'un backend Node.js (Express) connecté à une base de données PostgreSQL, orchestrée avec Docker Compose. Le mini-projet consistait à développer une API REST de calculatrice (addition, soustraction, multiplication, division) avec persistance des opérations en base de données et un frontend React.

### Ce que ça m'a apporté
- Comprendre la différence entre une machine physique, une machine virtuelle et un conteneur Docker
- Écrire un `Dockerfile` et un `docker-compose.yml` pour orchestrer plusieurs services
- Gérer les réseaux Docker, les volumes pour la persistance des données
- Connecter un frontend, un backend et une base de données dans un environnement conteneurisé
- Utiliser les variables d'environnement pour sécuriser les configurations sensibles

---

## Atelier 2 — Mini-Projet BDD (Behavior-Driven Development)

### Description
Rédaction de user stories, critères d'acceptation, scénarios BDD (Gherkin : Given / When / Then) et tests manuels pour une application e-commerce type Amazon. Travail sur 7 fonctionnalités : recherche produit, fiche produit, ajout au panier, gestion du panier, code promo, checkout, confirmation de commande.

### Ce que ça m'a apporté
- Comprendre le principe du BDD et son importance dans les équipes de développement
- Rédiger des user stories centrées sur l'utilisateur
- Définir des critères d'acceptation clairs et testables
- Écrire des scénarios Gherkin (Given / When / Then)
- Traduire des besoins métier en tests manuels structurés

---

## Atelier 3 — Déploiement CI/CD avec Vercel (Frontend) et Render (Backend)

### Description
Déploiement de l'application calculatrice sur des plateformes cloud : le frontend React sur Vercel et le backend Node.js sur Render. Mise en place d'un pipeline de déploiement continu permettant de déployer automatiquement à chaque push Git.

### Ce que ça m'a apporté
- Découvrir le déploiement d'applications en production
- Comprendre la différence entre hébergement frontend (statique) et backend (serveur)
- Configurer les variables d'environnement en production
- Gérer les CORS entre un frontend déployé et une API distante
- Comprendre le fonctionnement du déploiement continu (CD)

---

## Atelier 4 — Tests automatiques avec Jest en JavaScript

### Description
Mise en place de tests automatiques avec Jest pour valider les fonctions de calcul de l'API (add, sub, mul, div). Séparation du code en modules (`calculator.js` / `app.js`), écriture des tests unitaires, gestion des cas limites (division par zéro, paramètres invalides). Les tests ont également été exécutés directement à l'intérieur du conteneur Docker via `docker compose exec api npm test`, permettant de valider le bon fonctionnement de l'application dans son environnement conteneurisé.

### Ce que ça m'a apporté
- Comprendre l'importance des tests automatiques pour éviter les régressions
- Écrire des tests unitaires avec Jest (`expect`, `toBe`, `toThrow`)
- Séparer la logique métier de la couche Express pour faciliter les tests
- Lancer les tests avec `npm test` en local et avec `docker compose exec api npm test` dans le conteneur
- Comprendre que les tests doivent fonctionner aussi bien en local que dans l'environnement Docker
- Adopter une approche de développement plus fiable et professionnelle

---

## Atelier 5 — Intégration Continue (CI) avec GitHub Actions

### Description
Automatisation des tests Jest via une pipeline CI avec GitHub Actions. Création d'un workflow `.github/workflows/ci.yml` qui s'exécute automatiquement à chaque `git push` ou Pull Request : installation de Node.js, installation des dépendances, exécution des tests.

### Ce que ça m'a apporté
- Comprendre le principe de l'intégration continue (CI)
- Créer et configurer une pipeline GitHub Actions
- Automatiser l'exécution des tests à chaque modification du code
- Lire et analyser les résultats d'une pipeline (succès / échec)
- Comprendre l'importance de la CI dans une équipe de développement

---

## Atelier 6 — Monitoring avec Docker, Prometheus et Grafana

### Description
Mise en place d'une solution complète de monitoring pour l'API calculatrice. Ajout de `prom-client` dans le backend pour exposer des métriques via `/metrics`, configuration de Prometheus pour collecter les données toutes les 5 secondes, et visualisation dans des dashboards Grafana personnalisés.

### Ce que ça m'a apporté
- Comprendre l'importance du monitoring en production
- Exposer des métriques applicatives avec `prom-client` (Counter, collectDefaultMetrics)
- Configurer Prometheus comme collecteur de métriques
- Créer des dashboards Grafana pour visualiser le trafic en temps réel
- Voir concrètement l'architecture DevOps complète : API → Prometheus → Grafana

---

## Conclusion

Ces six ateliers m'ont permis de découvrir et de pratiquer les principales étapes du cycle de vie d'une application en environnement professionnel : du développement à la conteneurisation, en passant par les tests automatiques, l'intégration continue, le déploiement cloud et le monitoring en production.

La difficulté principale a été d'adapter les exemples du cours à mon projet existant (notamment l'intégration de Prometheus sur une API déjà connectée à PostgreSQL). Ces ateliers m'ont donné une vision concrète du métier DevOps et de l'importance de l'automatisation à chaque étape du développement logiciel.

---

*Rapport rédigé par Frejus Adedemi*