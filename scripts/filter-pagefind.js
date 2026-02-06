#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CWD = process.cwd();
const BUILD_DIR = path.join(CWD, ".next/server/app");
const BACKUP_DIR = path.join(CWD, ".pagefind-backup");

const EXCLUDE_FILES = ["_global-error.html", "_not-found.html"];

try {
  // Create backup dir and move excluded files
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const backedUpFiles = [];
  for (const filename of EXCLUDE_FILES) {
    const filePath = path.join(BUILD_DIR, filename);
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(BACKUP_DIR, filename);
      fs.copyFileSync(filePath, backupPath);
      fs.unlinkSync(filePath);
      backedUpFiles.push({ file: filePath, backup: backupPath, filename });
    }
  }

  // Run pagefind
  execSync(
    `pagefind --site ${BUILD_DIR} --output-path ${path.join(CWD, "public/_pagefind")}`,
    { stdio: "inherit" },
  );

  // Restore files
  for (const { file, backup } of backedUpFiles) {
    if (fs.existsSync(backup)) {
      fs.copyFileSync(backup, file);
      fs.unlinkSync(backup);
    }
  }

  // Cleanup
  if (fs.existsSync(BACKUP_DIR) && fs.readdirSync(BACKUP_DIR).length === 0) {
    fs.rmdirSync(BACKUP_DIR);
  }

  process.exit(0);
} catch (error) {
  console.error("Error:", error.message);

  // Restore on error
  if (fs.existsSync(BACKUP_DIR)) {
    const backupFiles = fs.readdirSync(BACKUP_DIR);
    for (const filename of backupFiles) {
      const file = path.join(BUILD_DIR, filename);
      const backup = path.join(BACKUP_DIR, filename);
      if (fs.existsSync(backup)) {
        fs.copyFileSync(backup, file);
        fs.unlinkSync(backup);
      }
    }
    if (backupFiles.length === 0) {
      fs.rmdirSync(BACKUP_DIR);
    }
  }

  process.exit(1);
}
