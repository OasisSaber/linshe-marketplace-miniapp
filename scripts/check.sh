#!/usr/bin/env bash
set -euo pipefail

# linshe-marketplace-miniapp 项目验证入口。
# 委托给现有 Node.js 验证脚本（package.json 的 npm run check）。

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

node scripts/check-project.js

echo "linshe-marketplace-miniapp project validation passed."
