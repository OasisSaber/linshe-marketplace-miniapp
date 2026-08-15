<#
  manage.ps1 - linshe-marketplace-miniapp self-management (DSH takeover 2026-08-16)

  Usage:
    .\manage.ps1 status   - repo/tool status and validation entry
    .\manage.ps1 check    - run authoritative validation (forwards bash scripts/check.sh -> npm run ci)
    .\manage.ps1 test     - run npm test only
    .\manage.ps1 docs     - list project documents
    .\manage.ps1 help     - this help

  Notes:
    - Output is intentionally ASCII to avoid GBK codepage mojibake.
    - Compatible with Windows PowerShell 5.1.
    - The authoritative validation entry is scripts/check.sh; this script only
      forwards it, it does not define its own validation logic.
#>

param([Parameter(Position = 0)][string]$Action = "help")

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Write-Step($msg) { Write-Output "[manage] $msg" }
function Test-Cmd($name) { return (Get-Command $name -ErrorAction SilentlyContinue) -ne $null }

switch ($Action.ToLower()) {
    "status" {
        Write-Step "repo root: $root"
        if (Test-Path ".jj") {
            Write-Step "vcs: jj (repo also has .git)"
            cmd /c "jj st 2>nul" 2>$null | Select-Object -First 12
        } elseif (Test-Path ".git") {
            Write-Step ("vcs: git, branch " + (& git branch --show-current 2>$null))
            cmd /c "git status --short 2>nul" 2>$null | Select-Object -First 12
        }
        if (Test-Cmd "node") { Write-Step ("node: " + (& node --version)) } else { Write-Step "node: NOT FOUND (check requires Node.js)" }
        if (Test-Cmd "jj") { Write-Step ("jj: " + (& jj --version)) } else { Write-Step "jj: not on PATH (optional)" }
        if (Test-Cmd "git") { Write-Step ("git: " + (& git --version)) } else { Write-Step "git: NOT FOUND" }
        Write-Step "validation entry: bash scripts/check.sh (npm run ci = structure check + full test suite)"
        Write-Step "governance: TheMasterplan via AGENTS.md; main branch accepts human Squash Merge only"
    }
    "check" {
        if (Test-Cmd "bash") {
            Write-Step "forwarding to bash scripts/check.sh"
            & bash scripts/check.sh
        } else {
            Write-Step "bash not found, falling back to npm run ci"
            & npm run ci
        }
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Write-Step "check passed"
    }
    "test" {
        & npm test
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Write-Step "tests passed"
    }
    "docs" {
        Write-Step "project documents:"
        Write-Output "  README.md          - product manual"
        Write-Output "  DEMO_GUIDE.md      - demo path & boundaries"
        Write-Output "  AGENTS.md          - governance (TheMasterplan) + DSH self-management"
        Write-Output "  core/              - workflow & policy rules"
        Write-Output "  profiles/          - git/jj command profiles"
        Write-Output "  adapters/          - harness boundary"
        Write-Output "  pei-tao-kai-fa-wendang/ - DOCX/PDF dev docs (Chinese name, excluded from miniprogram upload)"
    }
    "help" {
        Write-Output "manage.ps1 - linshe-marketplace-miniapp self-management (DSH takeover 2026-08-16)"
        Write-Output "  status   repo/tool status and validation entry"
        Write-Output "  check    run authoritative validation (bash scripts/check.sh -> npm run ci)"
        Write-Output "  test     run npm test only"
        Write-Output "  docs     list project documents"
        Write-Output "  help     this help"
    }
    default {
        Write-Error "unknown action '$Action' (use status|check|test|docs|help)"
        exit 1
    }
}
