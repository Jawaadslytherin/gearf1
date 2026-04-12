import { readFileSync } from 'fs';
import { join } from 'path';

/** Load `.env.production` then `.env` into `process.env` (does not override existing). */
export function loadEnvFiles(projectRoot) {
  for (const rel of ['.env.production', '.env']) {
    try {
      const text = readFileSync(join(projectRoot, rel), 'utf8');
      for (const line of text.split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const eq = t.indexOf('=');
        if (eq === -1) continue;
        const key = t.slice(0, eq).trim();
        let val = t.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) process.env[key] = val;
      }
    } catch {
      /* optional */
    }
  }
}
