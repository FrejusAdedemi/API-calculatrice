# 🧮 API Calculatrice

Une application web complète de calculatrice avec historique des opérations, conteneurisée avec Docker, testée avec Jest, déployée sur le cloud et supervisée avec Prometheus & Grafana.

🌐 **Frontend :** [api-calculatrice.vercel.app](https://api-calculatrice.vercel.app)
🚀 **Backend :** [api-calculatrice.onrender.com](https://api-calculatrice.onrender.com)

---

## 📦 Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Base de données | PostgreSQL |
| Conteneurisation | Docker + Docker Compose |
| Tests | Jest |
| CI/CD | GitHub Actions + Vercel + Render |
| Monitoring | Prometheus + Grafana |

---

## ✨ Fonctionnalités

- ➕ Addition, ➖ Soustraction, ✖️ Multiplication, ➗ Division
- 📜 Historique des opérations persisté en base de données
- 🗑️ Suppression d'une opération ou de tout l'historique
- 📊 Monitoring du trafic en temps réel avec Grafana
- ✅ Tests automatiques avec Jest
- 🔄 Pipeline CI/CD avec GitHub Actions

---

## 🗂️ Structure du projet

```
API-calculatrice/
├── backend/
│   ├── src/
│   │   ├── app.js          # Serveur Express + métriques Prometheus
│   │   └── calculator.js   # Fonctions de calcul pures
│   ├── tests/
│   │   └── calculator.test.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── prometheus/
│   └── prometheus.yml
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
└── .env
```

---

## 🚀 Lancer le projet en local

### Prérequis
- Docker & Docker Compose installés
- WSL (si Windows)

### 1. Cloner le repo
```bash
git clone https://github.com/FrejusAdedemi/API-calculatrice.git
cd API-calculatrice
```

### 2. Configurer les variables d'environnement
Créer un fichier `.env` à la racine :
```env
DATABASE_URL=postgresql://user:password@database:5432/calculatrice
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

### 3. Lancer l'application
```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

---

## 🧪 Lancer les tests

```bash
# En local
cd backend
npm test

# Dans le conteneur Docker
docker compose exec backend npm test
```

---

## 📊 Monitoring

L'API expose ses métriques via `/metrics` (format Prometheus).

Prometheus les collecte toutes les **5 secondes** et Grafana les affiche dans un dashboard temps réel.

```
API Node.js  →  /metrics  →  Prometheus  →  Grafana
```

---

## 🔄 Pipeline CI/CD

À chaque `git push`, GitHub Actions :
1. Installe Node.js
2. Installe les dépendances
3. Exécute les tests Jest automatiquement

Le frontend se déploie automatiquement sur **Vercel** et le backend sur **Render**.

---

## 📡 Endpoints de l'API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/add?a=5&b=2` | Addition |
| GET | `/sub?a=9&b=3` | Soustraction |
| GET | `/mul?a=4&b=3` | Multiplication |
| GET | `/div?a=10&b=2` | Division |
| GET | `/historique` | Liste des opérations |
| DELETE | `/historique/:id` | Supprimer une opération |
| DELETE | `/historique` | Vider l'historique |
| GET | `/metrics` | Métriques Prometheus |

---

*Projet réalisé par **Frejus Adedemi** dans le cadre d'une formation DevOps*