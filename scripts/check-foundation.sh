#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

node scripts/validate-ui-contracts.js
node --test
echo "Lin She quality foundation validation passed."
