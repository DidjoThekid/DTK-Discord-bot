# Discord Bot Manager

Site pour connecter, surveiller et piloter tous vos bots Discord depuis un seul tableau de bord, avec :

- **Inscription / connexion** par e-mail + mot de passe, avec **code de vérification à 6 chiffres** envoyé par e-mail à chaque inscription et connexion.
- **Comptes admin** voyant des **bots privés** en plus des bots publics.
- **Démarrage / arrêt** des bots depuis le site (via une petite API de contrôle que chaque bot expose — voir plus bas).
- **OAuth Discord** : chaque utilisateur peut lier son compte Discord pour ajouter un bot directement sur les serveurs où il a les droits.
- Déploiement pensé pour **Vercel** (Next.js + base de données Postgres gratuite compatible Vercel).

## Stack

- Next.js 14 (App Router, TypeScript)
- Prisma + PostgreSQL (Neon / Vercel Postgres / Supabase — au choix, toutes gratuites)
- Sessions par cookie JWT (httpOnly)
- Resend pour l'envoi d'e-mails (plan gratuit)
- Tailwind CSS

## ⚠️ Point important sur les bots

Vercel est **serverless** : il ne peut pas faire tourner un bot Discord en continu (connexion WebSocket permanente). Ce site n'héberge donc pas vos bots — il les **pilote à distance**.

Chaque bot doit :
1. Tourner là où il tourne déjà (VPS, Railway, Fly.io, Replit, etc.).
2. Exposer une petite API HTTP `/start`, `/stop`, `/status` sécurisée par une clé secrète.

Un exemple prêt à l'emploi est fourni dans `examples/bot-control-server.js` — à coller à côté du code de chacun de vos bots existants.

Si vous ne voulez pas cette fonctionnalité de démarrage/arrêt à distance, laissez simplement le champ "URL de l'API de contrôle" vide lors de la création du bot dans l'espace admin : le site affichera alors le bot sans les boutons démarrer/arrêter.

## 1. Installation locale

\`\`\`bash
git clone <url-de-votre-repo>
cd discord-bot-manager
npm install
cp .env.example .env
\`\`\`

Remplissez le fichier `.env` (voir section suivante), puis :

\`\`\`bash
npx prisma db push   # crée les tables dans votre base
npm run dev
\`\`\`

Le site est disponible sur http://localhost:3000.

## 2. Configuration des variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Connexion PostgreSQL (Neon, Vercel Postgres ou Supabase — toutes ont un plan gratuit) |
| `JWT_SECRET` | Chaîne aléatoire longue pour signer les sessions (`openssl rand -base64 48`) |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi des codes de vérification |
| `EMAIL_FROM` | Adresse d'expédition des e-mails |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | À récupérer sur le portail développeur Discord |
| `DISCORD_REDIRECT_URI` | Doit être ajoutée telle quelle dans "Redirects" sur le portail Discord |
| `NEXT_PUBLIC_APP_URL` | URL publique du site |

### Créer une base de données gratuite (recommandé : Neon, natif sur Vercel)

1. Sur votre projet Vercel → onglet **Storage** → **Create Database** → **Neon (Postgres)**.
2. Vercel remplit automatiquement `DATABASE_URL` pour vous.

### Créer une application Discord (pour l'OAuth et l'invitation des bots)

1. https://discord.com/developers/applications → **New Application**.
2. Section **OAuth2** → notez le **Client ID** et le **Client Secret**.
3. Ajoutez comme Redirect URI : `https://votre-domaine.vercel.app/api/discord/oauth/callback`.
4. Pour chaque bot existant, récupérez son propre **Client ID** (celui de son application Discord) : c'est celui à renseigner dans l'espace admin du site, pas celui du site lui-même.

### Créer un compte Resend (envoi des codes par e-mail)

1. https://resend.com → créez un compte gratuit (3000 e-mails/mois).
2. Récupérez votre clé API → `RESEND_API_KEY`.
3. Pour tester rapidement sans domaine vérifié, utilisez `onboarding@resend.dev` comme `EMAIL_FROM`.

## 3. Créer le premier compte administrateur

Il n'y a pas d'interface pour ça (pour des raisons de sécurité) : après avoir créé un compte normal sur le site, passez-le en admin directement en base :

\`\`\`bash
npx prisma studio
\`\`\`

Ouvrez la table `users`, trouvez votre compte, et passez `isAdmin` à `true`.

## 4. Pré-remplir vos bots (optionnel)

\`\`\`bash
npx prisma db seed
\`\`\`

Charge automatiquement les bots définis dans `prisma/seed.js`.

## 5. Pousser le projet sur GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit — Discord Bot Manager"
git branch -M main
git remote add origin https://github.com/<votre-utilisateur>/<nom-du-repo>.git
git push -u origin main
\`\`\`

## 6. Déployer sur Vercel

1. https://vercel.com/new → **Import Git Repository** → sélectionnez votre dépôt GitHub.
2. Ajoutez toutes les variables d'environnement du `.env` dans **Settings → Environment Variables**.
3. Déployez. Vercel exécute automatiquement `prisma generate` puis `next build`.
4. Exécutez `npx prisma db push` (avec l'URL de la base de prod) pour créer les tables si ce n'est pas déjà fait.
