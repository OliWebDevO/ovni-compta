# Plan d'Intégration Bridge API - O.V.N.I Compta

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Prérequis](#2-prérequis)
3. [Architecture technique](#3-architecture-technique)
4. [Schéma de base de données](#4-schéma-de-base-de-données)
5. [Flow de connexion bancaire](#5-flow-de-connexion-bancaire)
6. [Implémentation des webhooks](#6-implémentation-des-webhooks)
7. [Mapping des transactions](#7-mapping-des-transactions)
8. [Interface utilisateur](#8-interface-utilisateur)
9. [Sécurité](#9-sécurité)
10. [Tests et déploiement](#10-tests-et-déploiement)
11. [Maintenance et évolutions](#11-maintenance-et-évolutions)

---

## 1. Vue d'ensemble

### Objectif

Synchroniser automatiquement les transactions bancaires de l'ASBL avec l'application O.V.N.I Compta via l'API Bridge, permettant :

- **Création automatique** de transactions (crédit/débit) à partir des mouvements bancaires
- **Temps réel** via webhooks pour recevoir les nouvelles transactions instantanément
- **Réconciliation** entre les transactions manuelles et bancaires

### Bénéfices attendus

- Réduction du travail manuel de saisie
- Données financières toujours à jour
- Traçabilité complète des mouvements bancaires
- Réduction des erreurs de saisie

---

## 2. Prérequis

### 2.1 Compte Bridge

1. Créer un compte sur [Bridge Dashboard](https://dashboard.bridgeapi.io/signup)
2. Créer une application (sandbox puis production)
3. Récupérer les credentials :
   - `CLIENT_ID`
   - `CLIENT_SECRET`

### 2.2 Variables d'environnement

Ajouter dans `.env.local` :

```env
# Bridge API
BRIDGE_CLIENT_ID=your_client_id
BRIDGE_CLIENT_SECRET=your_client_secret
BRIDGE_API_VERSION=2025-01-15
BRIDGE_WEBHOOK_SECRET=your_webhook_secret

# URLs
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BRIDGE_WEBHOOK_URL=https://your-app.vercel.app/api/webhooks/bridge
```

### 2.3 Dépendances à installer

```bash
pnpm add crypto-js
# crypto-js pour la validation des signatures webhook
```

---

## 3. Architecture technique

### 3.1 Diagramme de flux

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Utilisateur   │     │   Bridge API    │     │   Banque ASBL   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ 1. Clic "Connecter    │                       │
         │    compte bancaire"   │                       │
         │──────────────────────>│                       │
         │                       │                       │
         │ 2. Redirection vers   │                       │
         │    Bridge Connect     │                       │
         │<──────────────────────│                       │
         │                       │                       │
         │ 3. Authentification   │                       │
         │    bancaire           │──────────────────────>│
         │                       │<──────────────────────│
         │                       │                       │
         │ 4. Callback + code    │                       │
         │<──────────────────────│                       │
         │                       │                       │
┌────────┴────────┐              │                       │
│  O.V.N.I Compta │              │                       │
└────────┬────────┘              │                       │
         │                       │                       │
         │ 5. Webhook:           │                       │
         │    item.account.updated                       │
         │<──────────────────────│                       │
         │                       │                       │
         │ 6. GET /transactions  │                       │
         │──────────────────────>│                       │
         │                       │                       │
         │ 7. Créer transactions │                       │
         │    dans Supabase      │                       │
         │                       │                       │
```

### 3.2 Structure des fichiers à créer

```
src/
├── app/
│   ├── api/
│   │   └── webhooks/
│   │       └── bridge/
│   │           └── route.ts          # Endpoint webhook
│   └── dashboard/
│       └── parametres/
│           └── banque/
│               └── page.tsx          # Page de connexion bancaire
├── lib/
│   ├── bridge/
│   │   ├── client.ts                 # Client API Bridge
│   │   ├── types.ts                  # Types TypeScript
│   │   ├── webhooks.ts               # Gestion webhooks
│   │   └── sync.ts                   # Logique de synchronisation
│   └── actions/
│       └── bridge.ts                 # Server actions Bridge
└── components/
    └── bridge/
        ├── ConnectBankButton.tsx     # Bouton de connexion
        ├── BankConnectionStatus.tsx  # Statut de connexion
        └── SyncHistory.tsx           # Historique de sync
```

---

## 4. Schéma de base de données

### 4.1 Nouvelles tables Supabase

```sql
-- Migration: 20250203_bridge_integration.sql

-- Table pour stocker la connexion Bridge de l'ASBL
CREATE TABLE bridge_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifiants Bridge
  bridge_user_uuid UUID NOT NULL,
  bridge_item_id BIGINT NOT NULL UNIQUE,

  -- Informations du compte
  bank_name TEXT NOT NULL,
  account_iban TEXT,
  account_name TEXT,
  account_type TEXT, -- checking, savings, etc.

  -- État de la connexion
  status TEXT NOT NULL DEFAULT 'active', -- active, error, expired, disconnected
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,

  -- Métadonnées
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Table pour le mapping transactions Bridge <-> App
CREATE TABLE bridge_transaction_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Référence Bridge
  bridge_transaction_id BIGINT NOT NULL UNIQUE,
  bridge_connection_id UUID NOT NULL REFERENCES bridge_connections(id) ON DELETE CASCADE,

  -- Référence transaction app (nullable si pas encore mappée)
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,

  -- Données brutes Bridge (pour debug/audit)
  raw_data JSONB NOT NULL,

  -- Statut du mapping
  status TEXT NOT NULL DEFAULT 'pending', -- pending, mapped, ignored, error
  mapping_error TEXT,

  -- Métadonnées
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Table pour l'historique des synchronisations
CREATE TABLE bridge_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  bridge_connection_id UUID NOT NULL REFERENCES bridge_connections(id) ON DELETE CASCADE,

  -- Résultat de la sync
  event_type TEXT NOT NULL, -- item.created, item.refreshed, item.account.updated
  transactions_received INT DEFAULT 0,
  transactions_created INT DEFAULT 0,
  transactions_updated INT DEFAULT 0,
  transactions_ignored INT DEFAULT 0,

  -- Erreurs éventuelles
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  -- Métadonnées
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_bridge_mappings_bridge_tx ON bridge_transaction_mappings(bridge_transaction_id);
CREATE INDEX idx_bridge_mappings_status ON bridge_transaction_mappings(status);
CREATE INDEX idx_bridge_sync_logs_connection ON bridge_sync_logs(bridge_connection_id);

-- Trigger pour updated_at
CREATE TRIGGER set_bridge_connections_updated_at
  BEFORE UPDATE ON bridge_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4.2 Modification de la table transactions

```sql
-- Ajouter une colonne pour identifier les transactions importées
ALTER TABLE transactions
ADD COLUMN source TEXT DEFAULT 'manual', -- manual, bridge
ADD COLUMN bridge_mapping_id UUID REFERENCES bridge_transaction_mappings(id);

-- Index
CREATE INDEX idx_transactions_source ON transactions(source);
```

---

## 5. Flow de connexion bancaire

### 5.1 Création d'un utilisateur Bridge

```typescript
// src/lib/bridge/client.ts

const BRIDGE_API_URL = 'https://api.bridgeapi.io';

interface BridgeConfig {
  clientId: string;
  clientSecret: string;
  apiVersion: string;
}

export class BridgeClient {
  private config: BridgeConfig;

  constructor() {
    this.config = {
      clientId: process.env.BRIDGE_CLIENT_ID!,
      clientSecret: process.env.BRIDGE_CLIENT_SECRET!,
      apiVersion: process.env.BRIDGE_API_VERSION || '2025-01-15',
    };
  }

  private getHeaders(accessToken?: string) {
    return {
      'Content-Type': 'application/json',
      'Client-Id': this.config.clientId,
      'Client-Secret': this.config.clientSecret,
      'Bridge-Version': this.config.apiVersion,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
  }

  // Créer un utilisateur Bridge
  async createUser(externalUserId: string, email: string) {
    const response = await fetch(`${BRIDGE_API_URL}/v3/aggregation/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        external_user_id: externalUserId,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bridge API error: ${response.status}`);
    }

    return response.json();
  }

  // Générer un token d'accès utilisateur
  async getUserAccessToken(bridgeUserUuid: string) {
    const response = await fetch(
      `${BRIDGE_API_URL}/v3/aggregation/users/${bridgeUserUuid}/access-token`,
      {
        method: 'POST',
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Bridge API error: ${response.status}`);
    }

    return response.json();
  }

  // Générer l'URL Bridge Connect
  async getConnectUrl(accessToken: string, callbackUrl: string) {
    const response = await fetch(`${BRIDGE_API_URL}/v3/connect/items/add/url`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        callback_url: callbackUrl,
        country: 'be', // Belgique
      }),
    });

    if (!response.ok) {
      throw new Error(`Bridge API error: ${response.status}`);
    }

    return response.json();
  }

  // Récupérer les transactions
  async getTransactions(
    accessToken: string,
    accountId: number,
    since?: string
  ) {
    const params = new URLSearchParams();
    if (since) params.append('since', since);
    params.append('account_id', accountId.toString());

    const response = await fetch(
      `${BRIDGE_API_URL}/v3/aggregation/transactions?${params}`,
      {
        method: 'GET',
        headers: this.getHeaders(accessToken),
      }
    );

    if (!response.ok) {
      throw new Error(`Bridge API error: ${response.status}`);
    }

    return response.json();
  }

  // Récupérer les comptes d'un item
  async getAccounts(accessToken: string, itemId: number) {
    const response = await fetch(
      `${BRIDGE_API_URL}/v3/aggregation/accounts?item_id=${itemId}`,
      {
        method: 'GET',
        headers: this.getHeaders(accessToken),
      }
    );

    if (!response.ok) {
      throw new Error(`Bridge API error: ${response.status}`);
    }

    return response.json();
  }
}

export const bridgeClient = new BridgeClient();
```

### 5.2 Server Action pour initier la connexion

```typescript
// src/lib/actions/bridge.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { bridgeClient } from '@/lib/bridge/client';
import { redirect } from 'next/navigation';

export async function initiateBankConnection() {
  const supabase = await createClient();

  // Vérifier l'authentification et les droits admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Droits insuffisants');
  }

  // Vérifier si une connexion Bridge existe déjà
  const { data: existingConnection } = await supabase
    .from('bridge_connections')
    .select('bridge_user_uuid')
    .limit(1)
    .single();

  let bridgeUserUuid: string;

  if (existingConnection?.bridge_user_uuid) {
    bridgeUserUuid = existingConnection.bridge_user_uuid;
  } else {
    // Créer un nouvel utilisateur Bridge
    const bridgeUser = await bridgeClient.createUser(
      `ovni-compta-${Date.now()}`,
      user.email!
    );
    bridgeUserUuid = bridgeUser.uuid;
  }

  // Obtenir un token d'accès
  const { access_token } = await bridgeClient.getUserAccessToken(bridgeUserUuid);

  // Générer l'URL Bridge Connect
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/bridge/callback`;
  const { url } = await bridgeClient.getConnectUrl(access_token, callbackUrl);

  // Stocker temporairement le bridge_user_uuid en session/cookie
  // (à implémenter selon votre gestion de session)

  redirect(url);
}

export async function getBankConnectionStatus() {
  const supabase = await createClient();

  const { data: connection } = await supabase
    .from('bridge_connections')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return connection;
}

export async function disconnectBank(connectionId: string) {
  const supabase = await createClient();

  // Vérifier les droits admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Droits insuffisants');
  }

  // Marquer comme déconnecté (ne pas supprimer pour garder l'historique)
  await supabase
    .from('bridge_connections')
    .update({ status: 'disconnected' })
    .eq('id', connectionId);

  return { success: true };
}
```

---

## 6. Implémentation des webhooks

### 6.1 Endpoint webhook

```typescript
// src/app/api/webhooks/bridge/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { bridgeClient } from '@/lib/bridge/client';
import { syncTransactions } from '@/lib/bridge/sync';
import crypto from 'crypto';

// Client Supabase avec service role pour les webhooks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// IPs autorisées Bridge (à whitelist)
const BRIDGE_IPS = ['63.32.31.5', '52.215.247.62', '34.249.92.209'];

// Vérifier la signature du webhook
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'IP source (optionnel mais recommandé)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor?.split(',')[0].trim();

    // En production, activer cette vérification :
    // if (!BRIDGE_IPS.includes(clientIp || '')) {
    //   return NextResponse.json({ error: 'Unauthorized IP' }, { status: 403 });
    // }

    const rawBody = await request.text();
    const signature = request.headers.get('bridge-signature');

    // Vérifier la signature (si configurée)
    if (process.env.BRIDGE_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature(
        rawBody,
        signature,
        process.env.BRIDGE_WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { type, content } = payload;

    console.log(`[Bridge Webhook] Received event: ${type}`, content);

    // Traiter selon le type d'événement
    switch (type) {
      case 'item.created':
        await handleItemCreated(content);
        break;

      case 'item.refreshed':
        await handleItemRefreshed(content);
        break;

      case 'item.account.updated':
        await handleAccountUpdated(content);
        break;

      case 'item.error':
        await handleItemError(content);
        break;

      default:
        console.log(`[Bridge Webhook] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Bridge Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleItemCreated(content: {
  item_id: number;
  user_uuid: string;
}) {
  const { item_id, user_uuid } = content;

  // Récupérer les infos du compte via l'API
  const { access_token } = await bridgeClient.getUserAccessToken(user_uuid);
  const { resources: accounts } = await bridgeClient.getAccounts(
    access_token,
    item_id
  );

  if (accounts.length === 0) {
    console.error('[Bridge] No accounts found for item:', item_id);
    return;
  }

  // Prendre le premier compte (ou gérer plusieurs comptes si nécessaire)
  const account = accounts[0];

  // Créer la connexion en base
  await supabaseAdmin.from('bridge_connections').insert({
    bridge_user_uuid: user_uuid,
    bridge_item_id: item_id,
    bank_name: account.bank_name || 'Banque inconnue',
    account_iban: account.iban,
    account_name: account.name,
    account_type: account.type,
    status: 'active',
    last_sync_at: new Date().toISOString(),
  });

  // Log
  await supabaseAdmin.from('bridge_sync_logs').insert({
    bridge_connection_id: (
      await supabaseAdmin
        .from('bridge_connections')
        .select('id')
        .eq('bridge_item_id', item_id)
        .single()
    ).data?.id,
    event_type: 'item.created',
    success: true,
  });

  // Synchroniser les transactions initiales
  await syncTransactions(user_uuid, item_id);
}

async function handleItemRefreshed(content: {
  item_id: number;
  user_uuid: string;
  full_refresh: boolean;
}) {
  const { item_id, user_uuid, full_refresh } = content;

  // Mettre à jour le statut
  await supabaseAdmin
    .from('bridge_connections')
    .update({
      status: 'active',
      last_sync_at: new Date().toISOString(),
      last_error: null,
    })
    .eq('bridge_item_id', item_id);

  // Synchroniser les transactions
  await syncTransactions(user_uuid, item_id, !full_refresh);
}

async function handleAccountUpdated(content: {
  item_id: number;
  user_uuid: string;
  account_id: number;
  nb_new_transactions: number;
  nb_deleted_transactions: number;
  nb_updated_transactions: number;
}) {
  const { item_id, user_uuid, nb_new_transactions } = content;

  if (nb_new_transactions > 0) {
    // Synchroniser uniquement les nouvelles transactions
    await syncTransactions(user_uuid, item_id, true);
  }

  // Log
  const { data: connection } = await supabaseAdmin
    .from('bridge_connections')
    .select('id')
    .eq('bridge_item_id', item_id)
    .single();

  if (connection) {
    await supabaseAdmin.from('bridge_sync_logs').insert({
      bridge_connection_id: connection.id,
      event_type: 'item.account.updated',
      transactions_received: nb_new_transactions,
      success: true,
    });
  }
}

async function handleItemError(content: {
  item_id: number;
  error_code: string;
  error_message: string;
}) {
  const { item_id, error_code, error_message } = content;

  await supabaseAdmin
    .from('bridge_connections')
    .update({
      status: 'error',
      last_error: `${error_code}: ${error_message}`,
    })
    .eq('bridge_item_id', item_id);
}
```

### 6.2 Configuration du webhook sur Bridge Dashboard

1. Aller sur [Bridge Dashboard](https://dashboard.bridgeapi.io)
2. Sélectionner votre application
3. Aller dans **Webhooks**
4. Ajouter l'URL : `https://your-app.vercel.app/api/webhooks/bridge`
5. Sélectionner les événements :
   - `item.created`
   - `item.refreshed`
   - `item.account.updated`
   - `item.error`
6. Générer et sauvegarder le secret pour la validation des signatures

---

## 7. Mapping des transactions

### 7.1 Logique de synchronisation

```typescript
// src/lib/bridge/sync.ts

import { createClient } from '@supabase/supabase-js';
import { bridgeClient } from './client';
import { mapBridgeTransaction } from './mapping';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function syncTransactions(
  bridgeUserUuid: string,
  itemId: number,
  incrementalOnly: boolean = false
) {
  try {
    // Récupérer la connexion
    const { data: connection } = await supabaseAdmin
      .from('bridge_connections')
      .select('*')
      .eq('bridge_item_id', itemId)
      .single();

    if (!connection) {
      console.error('[Sync] Connection not found for item:', itemId);
      return;
    }

    // Obtenir un token d'accès
    const { access_token } = await bridgeClient.getUserAccessToken(bridgeUserUuid);

    // Récupérer les comptes
    const { resources: accounts } = await bridgeClient.getAccounts(access_token, itemId);

    let totalCreated = 0;
    let totalUpdated = 0;
    let totalIgnored = 0;

    for (const account of accounts) {
      // Déterminer le paramètre "since" pour l'incrémental
      let since: string | undefined;

      if (incrementalOnly) {
        const { data: lastMapping } = await supabaseAdmin
          .from('bridge_transaction_mappings')
          .select('created_at')
          .eq('bridge_connection_id', connection.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (lastMapping) {
          // Prendre la date de la dernière sync moins 1 jour pour être sûr
          const lastDate = new Date(lastMapping.created_at);
          lastDate.setDate(lastDate.getDate() - 1);
          since = lastDate.toISOString().split('T')[0];
        }
      }

      // Récupérer les transactions
      const { resources: transactions } = await bridgeClient.getTransactions(
        access_token,
        account.id,
        since
      );

      for (const bridgeTx of transactions) {
        // Vérifier si déjà importée
        const { data: existingMapping } = await supabaseAdmin
          .from('bridge_transaction_mappings')
          .select('id, status')
          .eq('bridge_transaction_id', bridgeTx.id)
          .single();

        if (existingMapping) {
          if (existingMapping.status === 'mapped') {
            totalIgnored++;
            continue;
          }
        }

        // Ignorer les transactions futures
        if (bridgeTx.future) {
          totalIgnored++;
          continue;
        }

        // Mapper et créer la transaction
        const result = await mapBridgeTransaction(bridgeTx, connection.id);

        if (result.created) {
          totalCreated++;
        } else if (result.updated) {
          totalUpdated++;
        } else {
          totalIgnored++;
        }
      }
    }

    // Log de la synchronisation
    await supabaseAdmin.from('bridge_sync_logs').insert({
      bridge_connection_id: connection.id,
      event_type: 'sync_completed',
      transactions_created: totalCreated,
      transactions_updated: totalUpdated,
      transactions_ignored: totalIgnored,
      success: true,
    });

    console.log(
      `[Sync] Completed for item ${itemId}: ${totalCreated} created, ${totalUpdated} updated, ${totalIgnored} ignored`
    );
  } catch (error) {
    console.error('[Sync] Error:', error);

    // Log d'erreur
    const { data: connection } = await supabaseAdmin
      .from('bridge_connections')
      .select('id')
      .eq('bridge_item_id', itemId)
      .single();

    if (connection) {
      await supabaseAdmin.from('bridge_sync_logs').insert({
        bridge_connection_id: connection.id,
        event_type: 'sync_error',
        success: false,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
```

### 7.2 Mapping des transactions Bridge vers O.V.N.I Compta

```typescript
// src/lib/bridge/mapping.ts

import { createClient } from '@supabase/supabase-js';
import { TransactionCategorie } from '@/types';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BridgeTransaction {
  id: number;
  clean_description: string;
  bank_description: string;
  amount: number; // Positif = crédit, Négatif = débit
  date: string; // YYYY-MM-DD
  booking_date: string;
  category_id?: number;
  future: boolean;
  account_id: number;
}

// Mapping des catégories Bridge vers les catégories de l'app
const CATEGORY_MAPPING: Record<number, TransactionCategorie> = {
  // Revenus
  219: 'subvention', // Allocations, aides
  220: 'cachet', // Salaires

  // Dépenses
  270: 'loyer', // Loyer
  276: 'materiel', // Achats
  285: 'deplacement', // Transport

  // Banque
  295: 'frais_bancaires', // Frais bancaires

  // Par défaut
  0: 'autre',
};

// Mots-clés pour détecter les fournisseurs spécifiques
const VENDOR_KEYWORDS: Record<string, TransactionCategorie> = {
  'thomann': 'thoman',
  'smart': 'smart',
  'smartbe': 'smart',
};

function detectCategory(
  description: string,
  bridgeCategoryId?: number
): TransactionCategorie {
  const lowerDesc = description.toLowerCase();

  // Vérifier les mots-clés fournisseurs
  for (const [keyword, category] of Object.entries(VENDOR_KEYWORDS)) {
    if (lowerDesc.includes(keyword)) {
      return category;
    }
  }

  // Utiliser le mapping Bridge si disponible
  if (bridgeCategoryId && CATEGORY_MAPPING[bridgeCategoryId]) {
    return CATEGORY_MAPPING[bridgeCategoryId];
  }

  return 'autre';
}

export async function mapBridgeTransaction(
  bridgeTx: BridgeTransaction,
  connectionId: string
): Promise<{ created: boolean; updated: boolean; transactionId?: string }> {
  // Déterminer crédit ou débit
  const isCredit = bridgeTx.amount > 0;
  const amount = Math.abs(bridgeTx.amount);

  // Détecter la catégorie
  const category = detectCategory(
    bridgeTx.clean_description || bridgeTx.bank_description,
    bridgeTx.category_id
  );

  // Créer le mapping
  const { data: mapping, error: mappingError } = await supabaseAdmin
    .from('bridge_transaction_mappings')
    .upsert(
      {
        bridge_transaction_id: bridgeTx.id,
        bridge_connection_id: connectionId,
        raw_data: bridgeTx,
        status: 'pending',
      },
      { onConflict: 'bridge_transaction_id' }
    )
    .select()
    .single();

  if (mappingError) {
    console.error('[Mapping] Error creating mapping:', mappingError);
    return { created: false, updated: false };
  }

  // Créer la transaction dans l'app
  const transactionData = {
    date: bridgeTx.booking_date || bridgeTx.date,
    description: bridgeTx.clean_description || bridgeTx.bank_description,
    credit: isCredit ? amount : 0,
    debit: isCredit ? 0 : amount,
    categorie: category,
    source: 'bridge',
    bridge_mapping_id: mapping.id,
    // artiste_id et projet_id restent null - à assigner manuellement
  };

  const { data: transaction, error: txError } = await supabaseAdmin
    .from('transactions')
    .insert(transactionData)
    .select()
    .single();

  if (txError) {
    console.error('[Mapping] Error creating transaction:', txError);

    await supabaseAdmin
      .from('bridge_transaction_mappings')
      .update({
        status: 'error',
        mapping_error: txError.message,
      })
      .eq('id', mapping.id);

    return { created: false, updated: false };
  }

  // Mettre à jour le mapping avec l'ID de la transaction
  await supabaseAdmin
    .from('bridge_transaction_mappings')
    .update({
      transaction_id: transaction.id,
      status: 'mapped',
      processed_at: new Date().toISOString(),
    })
    .eq('id', mapping.id);

  return { created: true, updated: false, transactionId: transaction.id };
}
```

---

## 8. Interface utilisateur

### 8.1 Page de paramètres bancaires

```typescript
// src/app/dashboard/parametres/banque/page.tsx

import { Suspense } from 'react';
import { getBankConnectionStatus } from '@/lib/actions/bridge';
import { ConnectBankButton } from '@/components/bridge/ConnectBankButton';
import { BankConnectionStatus } from '@/components/bridge/BankConnectionStatus';
import { SyncHistory } from '@/components/bridge/SyncHistory';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default async function BankSettingsPage() {
  const connection = await getBankConnectionStatus();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connexion Bancaire"
        description="Synchronisez automatiquement les transactions de votre compte bancaire"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Statut de connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Compte bancaire
            </CardTitle>
            <CardDescription>
              {connection
                ? 'Votre compte est connecté via Bridge'
                : 'Aucun compte bancaire connecté'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connection ? (
              <BankConnectionStatus connection={connection} />
            ) : (
              <ConnectBankButton />
            )}
          </CardContent>
        </Card>

        {/* Historique de synchronisation */}
        {connection && (
          <Card>
            <CardHeader>
              <CardTitle>Historique de synchronisation</CardTitle>
              <CardDescription>
                Dernières synchronisations avec votre banque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Chargement...</div>}>
                <SyncHistory connectionId={connection.id} />
              </Suspense>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transactions importées en attente */}
      {connection && (
        <Card>
          <CardHeader>
            <CardTitle>Transactions à catégoriser</CardTitle>
            <CardDescription>
              Transactions importées qui nécessitent une attribution à un artiste ou projet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Liste des transactions avec source='bridge' et artiste_id=null */}
            <Suspense fallback={<div>Chargement...</div>}>
              {/* <PendingBridgeTransactions /> */}
              <p className="text-muted-foreground text-sm">
                À implémenter : liste des transactions importées sans attribution
              </p>
            </Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### 8.2 Composants UI

```typescript
// src/components/bridge/ConnectBankButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { initiateBankConnection } from '@/lib/actions/bridge';

export function ConnectBankButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await initiateBankConnection();
    } catch (error) {
      console.error('Error initiating bank connection:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connectez le compte bancaire de l'ASBL pour importer automatiquement les
        transactions. La connexion est sécurisée via Bridge, un agrégateur bancaire
        agréé.
      </p>
      <Button onClick={handleConnect} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          <>
            <LinkIcon className="mr-2 h-4 w-4" />
            Connecter un compte bancaire
          </>
        )}
      </Button>
    </div>
  );
}
```

```typescript
// src/components/bridge/BankConnectionStatus.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Unlink
} from 'lucide-react';
import { disconnectBank } from '@/lib/actions/bridge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BankConnection {
  id: string;
  bank_name: string;
  account_iban?: string;
  account_name?: string;
  status: string;
  last_sync_at?: string;
  last_error?: string;
}

export function BankConnectionStatus({ connection }: { connection: BankConnection }) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter ce compte bancaire ?')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      await disconnectBank(connection.id);
      window.location.reload();
    } catch (error) {
      console.error('Error disconnecting:', error);
      setIsDisconnecting(false);
    }
  };

  const statusConfig = {
    active: {
      icon: CheckCircle,
      label: 'Connecté',
      variant: 'default' as const,
      color: 'text-green-500',
    },
    error: {
      icon: XCircle,
      label: 'Erreur',
      variant: 'destructive' as const,
      color: 'text-red-500',
    },
    expired: {
      icon: AlertCircle,
      label: 'Expiré',
      variant: 'secondary' as const,
      color: 'text-yellow-500',
    },
    disconnected: {
      icon: Unlink,
      label: 'Déconnecté',
      variant: 'outline' as const,
      color: 'text-gray-500',
    },
  };

  const status = statusConfig[connection.status as keyof typeof statusConfig] || statusConfig.error;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
            <span className="font-medium">{connection.bank_name}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          {connection.account_iban && (
            <p className="text-sm text-muted-foreground font-mono">
              {connection.account_iban}
            </p>
          )}
          {connection.account_name && (
            <p className="text-sm text-muted-foreground">
              {connection.account_name}
            </p>
          )}
        </div>
      </div>

      {connection.last_error && (
        <div className="p-3 bg-destructive/10 rounded-md">
          <p className="text-sm text-destructive">{connection.last_error}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Dernière sync :{' '}
          {connection.last_sync_at
            ? formatDistanceToNow(new Date(connection.last_sync_at), {
                addSuffix: true,
                locale: fr,
              })
            : 'Jamais'}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Forcer sync
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            <Unlink className="mr-2 h-4 w-4" />
            Déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 9. Sécurité

### 9.1 Checklist sécurité

- [ ] **Variables d'environnement** : Ne jamais commiter les credentials Bridge
- [ ] **Validation des webhooks** : Toujours vérifier la signature
- [ ] **Whitelist IP** : Configurer le firewall pour n'accepter que les IPs Bridge
- [ ] **HTTPS** : Obligatoire pour le callback et le webhook
- [ ] **Droits d'accès** : Seuls les admins peuvent connecter/déconnecter la banque
- [ ] **Logs d'audit** : Tracer toutes les synchronisations
- [ ] **Pas de stockage de credentials** : Bridge gère l'authentification bancaire

### 9.2 Variables à ne jamais exposer côté client

```typescript
// Ces variables doivent rester côté serveur uniquement
BRIDGE_CLIENT_ID
BRIDGE_CLIENT_SECRET
BRIDGE_WEBHOOK_SECRET
SUPABASE_SERVICE_ROLE_KEY
```

---

## 10. Tests et déploiement

### 10.1 Tests en sandbox

1. Utiliser les credentials sandbox de Bridge
2. Tester avec les banques de test fournies par Bridge
3. Simuler les webhooks avec l'outil Bridge Dashboard

### 10.2 Checklist avant mise en production

- [ ] Créer une application Bridge en production
- [ ] Mettre à jour les variables d'environnement sur Vercel
- [ ] Configurer le webhook avec l'URL de production
- [ ] Vérifier les IPs Bridge dans le firewall (si applicable)
- [ ] Tester la connexion avec un compte réel (compte de test ASBL)
- [ ] Valider le flow complet : connexion → webhook → création transaction

### 10.3 Monitoring

- Configurer des alertes sur les erreurs de synchronisation
- Monitorer le nombre de transactions importées vs créées manuellement
- Vérifier régulièrement le statut de la connexion Bridge

---

## 11. Maintenance et évolutions

### 11.1 Tâches de maintenance régulières

- **Hebdomadaire** : Vérifier les logs de synchronisation
- **Mensuelle** : Vérifier le statut de la connexion Bridge
- **Annuelle** : Renouveler la connexion si nécessaire

### 11.2 Évolutions possibles

1. **Réconciliation automatique** : Matcher les transactions manuelles avec les imports Bridge
2. **Règles de catégorisation** : Interface pour définir des règles personnalisées
3. **Multi-comptes** : Supporter plusieurs comptes bancaires
4. **Notifications** : Alerter lors de nouvelles transactions importantes
5. **Export comptable** : Générer des rapports compatibles avec les logiciels comptables belges

### 11.3 Ressources Bridge

- [Documentation Bridge API](https://docs.bridgeapi.io/)
- [Bridge Dashboard](https://dashboard.bridgeapi.io/)
- [Webhooks Reference](https://docs.bridgeapi.io/docs/webhooks-events)
- [Data Fetching Guide](https://docs.bridgeapi.io/docs/data-fetching)

---

## Résumé des étapes d'implémentation

1. **Créer compte Bridge** et récupérer les credentials
2. **Ajouter les variables d'environnement**
3. **Créer les tables Supabase** (migration)
4. **Implémenter le client Bridge** (`src/lib/bridge/`)
5. **Créer l'endpoint webhook** (`src/app/api/webhooks/bridge/`)
6. **Configurer le webhook sur Bridge Dashboard**
7. **Créer les server actions** (`src/lib/actions/bridge.ts`)
8. **Créer l'UI de connexion** (`src/app/dashboard/parametres/banque/`)
9. **Tester en sandbox**
10. **Déployer en production**

---

*Document créé le 3 février 2026*
*Version : 1.0*
