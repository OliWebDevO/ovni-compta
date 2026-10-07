// Télécharge tous les fichiers du bucket "factures" dans le dossier donné.
// Usage : node --env-file=.env.local scripts/backup-storage.mjs <dossier>
import { createClient } from '@supabase/supabase-js';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BUCKET = 'factures';
const PAGE_SIZE = 100;

const dest = process.argv[2];
if (!dest) {
  console.error('Usage : node --env-file=.env.local scripts/backup-storage.mjs <dossier>');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

await mkdir(dest, { recursive: true });

let count = 0;
for (let offset = 0; ; offset += PAGE_SIZE) {
  const { data: files, error } = await supabase.storage
    .from(BUCKET)
    .list('', { limit: PAGE_SIZE, offset, sortBy: { column: 'name', order: 'asc' } });
  if (error) throw error;

  for (const file of files) {
    if (!file.id) continue; // dossier, pas un fichier

    const { data: blob, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(file.name);
    if (downloadError) throw downloadError;

    await writeFile(path.join(dest, file.name), Buffer.from(await blob.arrayBuffer()));
    count++;
  }

  if (files.length < PAGE_SIZE) break;
}

console.log(`${count} fichier(s) téléchargé(s) depuis le bucket "${BUCKET}"`);
