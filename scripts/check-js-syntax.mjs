#!/usr/bin/env node
/**
 * Syntax-check all app JS modules (node --check).
 * Run: node scripts/check-js-syntax.mjs
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const jsDir = path.join(root, 'js')
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).sort()

let failed = 0

console.log(`Checking ${files.length} JS modules...\n`)

for (const file of files) {
  const filePath = path.join(jsDir, file)
  try {
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' })
    console.log(`✓ ${file}`)
  } catch (error) {
    console.log(`✗ ${file}`)
    console.log(`  ${error.stderr?.toString().trim() || error.message}`)
    failed += 1
  }
}

console.log(failed ? `\n${failed} file(s) failed syntax check.` : `\nAll ${files.length} modules OK.`)
process.exit(failed ? 1 : 0)
