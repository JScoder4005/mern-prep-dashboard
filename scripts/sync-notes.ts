/**
 * sync-notes — copy the markdown notes from the vault repo into this app's `content/`.
 *
 * Run manually when notes change:  pnpm sync-notes
 * The vault only exists on the author's machine, so `content/` is committed and ships
 * inside the Docker image (self-contained build — no external path at runtime).
 *
 * Override the source with:  VAULT_DIR=/path/to/vault pnpm sync-notes
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const VAULT_DIR = process.env.VAULT_DIR ?? "/Users/uday/Documents/mern-interview-vault";
const CONTENT_DIR = join(process.cwd(), "content");

// Section folders are named "NN-Name" with NN >= 01 (skips the "00-" guide + loose files).
const SECTION_RE = /^(\d{2})-.+/;

function isSectionFolder(name: string): boolean {
  const match = SECTION_RE.exec(name);
  if (!match) return false;
  return Number(match[1]) >= 1;
}

function main(): void {
  if (!existsSync(VAULT_DIR)) {
    console.error(`✗ Vault not found at ${VAULT_DIR}. Set VAULT_DIR to override.`);
    process.exit(1);
  }

  // Clean then recreate, so deleted notes don't linger.
  rmSync(CONTENT_DIR, { recursive: true, force: true });
  mkdirSync(CONTENT_DIR, { recursive: true });

  const sections = readdirSync(VAULT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isSectionFolder(entry.name))
    .map((entry) => entry.name)
    .sort();

  let fileCount = 0;
  for (const section of sections) {
    const from = join(VAULT_DIR, section);
    const to = join(CONTENT_DIR, section);
    // Copy only .md files, preserving the folder name (drives section slug/order).
    cpSync(from, to, {
      recursive: true,
      filter: (src) => !src.endsWith(".DS_Store"),
    });
    const mdCount = readdirSync(to).filter((f) => f.endsWith(".md")).length;
    fileCount += mdCount;
    console.log(`  ${section}: ${mdCount} notes`);
  }

  console.log(`✓ Synced ${fileCount} notes across ${sections.length} sections → content/`);
}

main();
