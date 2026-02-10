# OVNI Compta -- Application de gestion comptable sur mesure

## Le projet en bref

**OVNI Compta** est une application web de gestion comptable que j'ai concue et developpee sur mesure pour une ASBL belge active dans le secteur culturel et artistique.

Le client avait besoin d'un outil simple et clair pour suivre les finances de son association : les comptes de chaque artiste membre, les budgets de chaque projet, et la tresorerie centrale. Aucun logiciel existant ne repondait a ce besoin specifique -- j'ai donc cree une solution adaptee a 100% a leur fonctionnement.

**Client** : Association culturelle belge (ASBL)
**Type** : Application web privee, accessible sur invitation
**Langue** : Interface en francais
**Statut** : En production
**URL** : [www.asbl-ovni.com](https://www.asbl-ovni.com/)

---

## Le probleme du client

L'association gerait sa comptabilite sur des fichiers Excel partages. Plusieurs membres devaient y acceder, les erreurs de saisie etaient frequentes, et il n'y avait aucune visibilite claire sur les finances par artiste ou par projet. Les rapports financiers etaient fastidieux a produire manuellement.

## La solution

Une application web sur mesure qui centralise toute la comptabilite dans un seul outil securise, accessible depuis n'importe quel appareil, avec des calculs automatiques et des rapports generes en un clic.

---

## Fonctionnalites

### Tableau de bord

L'utilisateur se connecte et voit immediatement l'etat financier de l'association :
- Solde global, total des entrees et sorties
- Graphiques interactifs montrant l'evolution des finances sur les 12 derniers mois
- Dernieres transactions en un coup d'oeil
- Acces rapide a toutes les sections

### Suivi des entrees et sorties

Chaque operation financiere est enregistree avec :
- Le montant (entree ou sortie)
- Une categorie (loyer, materiel, subvention, cachet, frais bancaires...)
- Le membre et/ou le projet concerne
- La date et une description

L'historique complet est consultable avec des filtres par date, membre, projet ou categorie.

### Virements internes

L'association peut deplacer des fonds entre ses differents comptes internes :
- D'un membre a un autre
- D'un projet a un autre
- Depuis ou vers la tresorerie centrale

Chaque virement est enregistre automatiquement des deux cotes (debit + credit), ce qui garantit que les comptes restent toujours equilibres.

### Tresorerie centrale

La tresorerie de l'association dispose de sa propre page dediee pour suivre les operations qui ne sont rattachees a aucun membre ni projet : frais generaux, subventions globales, etc.

### Fiches membres

Chaque membre de l'association a sa propre fiche avec :
- Ses coordonnees
- Son solde en temps reel (calcule automatiquement)
- L'historique de toutes ses transactions
- Une couleur personnalisee pour le reperer facilement dans l'interface

### Fiches projets

Chaque projet est suivi individuellement :
- Budget prevu et depenses reelles
- Indicateur visuel du budget restant
- Statut du projet (en cours, termine, annule)
- Dates de debut et fin
- Historique de toutes les transactions liees

### Rapports financiers

Des bilans sont generes automatiquement :
- **Bilan annuel** : Vue d'ensemble par annee, avec comparaison d'une annee a l'autre
- **Bilan mensuel** : Detail mois par mois
- **Graphiques** : Courbes d'evolution et diagrammes en barres
- **Export** : Telechargement en CSV (compatible Excel) ou impression PDF

### Archivage de documents

Les factures et pieces justificatives sont centralisees dans l'application :
- Upload de fichiers PDF
- Association a un membre, un projet, ou a l'ASBL
- Telechargement securise a tout moment
- Classement par date et description

### Base de connaissances

Un espace interne pour centraliser les documents utiles de l'association :
- Guides pratiques, informations juridiques, liens utiles
- Systeme de tags et de categories
- Gestion reservee aux administrateurs

### Export des donnees

Toutes les donnees sont exportables :
- Transactions, virements, bilans : export CSV compatible Excel
- Rapports : impression PDF optimisee pour le format A4
- Totaux calcules automatiquement dans les exports

---

## Gestion des acces et securite

### Inscription sur invitation uniquement

L'application n'est pas ouverte au public. Seul un administrateur peut inviter de nouveaux utilisateurs par email. Chaque invitation est a usage unique et possede une date d'expiration.

### Trois niveaux de droits

| | Administrateur | Editeur | Lecteur |
|---|:---:|:---:|:---:|
| Consulter les donnees | Oui | Oui | Oui |
| Ajouter / Modifier | Oui | Oui | Non |
| Supprimer | Oui | Non | Non |
| Gerer les utilisateurs | Oui | Non | Non |

### Donnees protegees

- Les mots de passe sont chiffres
- Chaque utilisateur n'accede qu'aux donnees autorisees par son role
- Les fichiers uploades sont stockes de maniere securisee et accessibles uniquement aux utilisateurs connectes
- Protection contre les attaques courantes (injection, XSS, brute force)

---

## Design et experience utilisateur

- **Interface moderne et epuree** avec une identite visuelle soignee (degrades violets, couleurs semantiques pour les credits/debits)
- **Responsive** : fonctionne sur ordinateur, tablette et smartphone
- **Navigation adaptee** : sidebar sur desktop, barre de navigation en bas sur mobile
- **Mode sombre et clair** : bascule possible selon la preference de l'utilisateur
- **Animations fluides** et retours visuels immediats
- **Illustrations personnalisees** pour rendre l'experience plus agreable
- **Accessibilite** : navigation au clavier, compatibilite lecteurs d'ecran

---

## Ce qui rend ce projet unique

1. **Comptabilite a trois niveaux** : Membres, projets et tresorerie centrale sont geres dans un seul outil, avec des virements internes automatises entre les trois
2. **Calculs en temps reel** : Les soldes, budgets restants et bilans sont toujours a jour, sans aucune saisie manuelle supplementaire
3. **Sur mesure a 100%** : Chaque fonctionnalite a ete concue pour repondre exactement au fonctionnement de ce client
4. **Simple a utiliser** : Malgre la richesse des fonctionnalites, l'interface reste intuitive -- aucune formation complexe necessaire
5. **Securise** : Acces sur invitation, droits par role, donnees protegees a chaque niveau
6. **Autonome** : Le client gere tout lui-meme au quotidien, sans intervention technique

---

## Adaptable a votre activite

Ce type de solution peut etre adapte a tout commerce ou organisation qui a besoin de :

- **Suivre des finances** par departement, membre, equipe ou projet
- **Gerer des budgets** par activite avec un suivi des depenses en temps reel
- **Centraliser des documents** (factures, contrats, justificatifs)
- **Generer des rapports** financiers automatiques (mensuels, annuels)
- **Controler les acces** avec differents niveaux de droits selon le role de chaque utilisateur
- **Remplacer des fichiers Excel** partages par un outil fiable, securise et accessible partout

Exemples de secteurs : associations (ASBL/VZW), PME, agences, clubs sportifs, ecoles, cooperatives, espaces de coworking...

---

## Fiche technique (pour les curieux)

| | |
|---|---|
| **Type d'application** | Application web (accessible via navigateur) |
| **Technologies principales** | Next.js, React, TypeScript, Supabase, Tailwind CSS |
| **Base de donnees** | PostgreSQL (via Supabase) |
| **Hebergement** | Vercel (serveur) + Supabase (base de donnees et fichiers) |
| **Emails** | Envoi automatique d'invitations par email |
| **Performances** | Chargement rapide, calculs instantanes, optimise pour mobile |
| **Securite** | Chiffrement, controle d'acces par role, protection contre les attaques courantes |
