# O.V.N.I Compta

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**Application de gestion comptable pour ASBL**

[Demo](#) | [Documentation](#fonctionnalites) | [Installation](#installation)

</div>

---

## A propos

**O.V.N.I Compta** est une application web moderne de gestion comptable conçue pour les ASBL (associations sans but lucratif) belges. Elle permet de suivre les finances, gérer les artistes et projets, et générer des bilans annuels conformes aux exigences légales.

### Captures d'ecran

<details>
<summary>Voir les captures d'ecran</summary>

| Dashboard | Transactions | Bilans |
|:---------:|:------------:|:------:|
| Vue d'ensemble des finances | Historique des mouvements | Analyse annuelle |

</details>

---

## Fonctionnalites

### Gestion Financiere
- **Transactions** - Suivi complet des credits et debits avec categorisation
- **Transferts internes** - Mouvements entre artistes et projets
- **Bilans automatiques** - Generation automatique des bilans mensuels et annuels
- **Export** - CSV et PDF pour la comptabilite officielle

### Gestion des Entites
- **Artistes** - Profils avec statistiques financieres
- **Projets** - Suivi budgetaire et progression
- **Categories** - Organisation des transactions (Smart, Thoman, Subventions, etc.)

### Fonctionnalites Avancees
- **Roles et permissions** - Admin, Editeur, Lecteur
- **Invitations par email** - Systeme d'invitation securise
- **Graphiques interactifs** - Visualisation des donnees avec Recharts
- **Mode impression** - Bilans optimises pour l'impression
- **Responsive** - Interface adaptee mobile et desktop

---

## Stack Technique

| Technologie | Utilisation |
|-------------|-------------|
| **Next.js 16** | Framework React avec App Router |
| **TypeScript** | Typage statique |
| **Supabase** | Base de donnees PostgreSQL + Auth |
| **Tailwind CSS** | Styling utilitaire |
| **shadcn/ui** | Composants UI accessibles |
| **Recharts** | Graphiques et visualisations |
| **Resend** | Envoi d'emails transactionnels |

---

## Installation

### Prerequis

- Node.js 18+
- pnpm (recommande) ou npm
- Compte Supabase

### Etapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/ovni-compta.git
   cd ovni-compta
   ```

2. **Installer les dependances**
   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```

   Remplir les variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Lancer le serveur de developpement**
   ```bash
   pnpm dev
   ```

5. **Ouvrir l'application**

   Naviguer vers [http://localhost:3000](http://localhost:3000)

---

## Structure du Projet

```
ovni-compta/
├── src/
│   ├── app/                    # Pages et routes (App Router)
│   │   ├── dashboard/          # Pages du tableau de bord
│   │   │   ├── artistes/       # Gestion des artistes
│   │   │   ├── projets/        # Gestion des projets
│   │   │   ├── transactions/   # Gestion des transactions
│   │   │   ├── bilans/         # Bilans et rapports
│   │   │   └── transferts/     # Transferts internes
│   │   └── auth/               # Authentification
│   ├── components/             # Composants React reutilisables
│   │   └── ui/                 # Composants shadcn/ui
│   ├── lib/                    # Utilitaires et logique metier
│   │   ├── actions/            # Server Actions
│   │   └── supabase/           # Client Supabase
│   ├── hooks/                  # Hooks React personnalises
│   └── types/                  # Types TypeScript
├── public/                     # Assets statiques
└── supabase/                   # Migrations et config Supabase
```

---

## Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de developpement |
| `pnpm build` | Build de production |
| `pnpm start` | Demarrer en production |
| `pnpm lint` | Linter ESLint |
| `pnpm type-check` | Verification TypeScript |

---

## Deploiement

### Vercel (Recommande)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/ovni-compta)

### Variables d'environnement requises

Configurer ces variables dans votre plateforme de deploiement:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

---

## Contribution

Les contributions sont les bienvenues ! N'hesitez pas a ouvrir une issue ou une pull request.

1. Fork le projet
2. Creer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout d'une fonctionnalite'`)
4. Push sur la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de details.

---

<div align="center">

Developpe avec :heart: pour [O.V.N.I ASBL](https://ovni.be)

</div>
