#!/bin/zsh
# ------------------------------------------------------------------
#  Deploy to Live Site
#
#  Double-click this file in Finder. It opens Terminal and:
#    1. checks you're on the main branch
#    2. shows any uncommitted work and asks whether to commit it
#    3. pulls anything new from GitHub
#    4. runs the type-check and a production build as a pre-flight
#    5. pushes main to GitHub
#
#  A push to main is the deploy: Cloud Run continuous deployment
#  builds the new revision and swaps it live, usually within ~5-10 min.
#  Nothing is pushed if any step fails.
# ------------------------------------------------------------------

set -u
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")" || exit 1

BOLD=$'\e[1m'; GREEN=$'\e[32m'; RED=$'\e[31m'; YELLOW=$'\e[33m'; DIM=$'\e[2m'; RESET=$'\e[0m'
SITE_URL="https://mappingtherabbithole.com/"
CLOUD_RUN_URL="https://console.cloud.google.com/run/detail/us-east1/mtrh-interactive-map/revisions?project=152667123998"
GITHUB_URL="https://github.com/northbeastclothing-design/MTRH/commits/main"

finish() {
  echo
  echo "${DIM}Press Enter to close this window.${RESET}"
  read -r _
  exit "$1"
}
fail() { echo; echo "${RED}${BOLD}✖ $1${RESET}"; echo "${RED}Nothing was pushed. The live site is unchanged.${RESET}"; finish 1; }
step() { echo; echo "${BOLD}▶ $1${RESET}"; }

echo "${BOLD}MTRH — Deploy to Live Site${RESET}"
echo "${DIM}$(pwd)${RESET}"

# 1. Branch check -------------------------------------------------------------
step "Checking branch"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || fail "This folder is not a git repository."
[[ "$BRANCH" == "main" ]] || fail "You are on branch '$BRANCH'. Switch to 'main' first (only main deploys)."
echo "On main."

# 2. Uncommitted work ---------------------------------------------------------
step "Checking for uncommitted changes"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "${YELLOW}These files have changes that are not committed yet:${RESET}"
  git status --short
  echo
  printf "Include them in this deploy? [y/N] "
  read -r INCLUDE
  if [[ "$INCLUDE" == [yY]* ]]; then
    printf "Commit message (Enter for 'deploy: site update'): "
    read -r MSG
    [[ -z "$MSG" ]] && MSG="deploy: site update"
    git add -A || fail "git add failed."
    git commit -q -m "$MSG" || fail "git commit failed."
    echo "${GREEN}Committed: $MSG${RESET}"
  else
    printf "Deploy WITHOUT them (only already-committed work goes live)? [y/N] "
    read -r SKIP
    [[ "$SKIP" == [yY]* ]] || fail "Stopped so you can sort out the uncommitted files."
    echo "Leaving uncommitted files alone."
  fi
else
  echo "Working tree is clean."
fi

# 3. Sync with GitHub ---------------------------------------------------------
step "Syncing with GitHub"
git fetch -q origin main || fail "Could not reach GitHub. Check your internet connection."
BEHIND=$(git rev-list --count main..origin/main)
if (( BEHIND > 0 )); then
  echo "GitHub has $BEHIND newer commit(s). Pulling them in..."
  git pull -q --rebase origin main || { git rebase --abort 2>/dev/null; fail "Pull conflicted with your local commits. Resolve it in your editor, then run this again."; }
fi
AHEAD=$(git rev-list --count origin/main..main)
if (( AHEAD == 0 )); then
  echo "${GREEN}GitHub already has everything. The live site is up to date — nothing to deploy.${RESET}"
  finish 0
fi
echo "$AHEAD commit(s) ready to deploy:"
git --no-pager log --oneline origin/main..main | sed 's/^/   /'

# 4. Pre-flight ---------------------------------------------------------------
step "Pre-flight: type-check"
npm run --silent lint || fail "Type-check failed (see errors above). Fix them before deploying."
echo "${GREEN}Types OK.${RESET}"

step "Pre-flight: production build"
npm run --silent build > /dev/null 2> /tmp/mtrh-build-errors.log || { cat /tmp/mtrh-build-errors.log; fail "Production build failed (see errors above)."; }
echo "${GREEN}Build OK.${RESET}"

# 5. Push = deploy ------------------------------------------------------------
step "Pushing main to GitHub (this triggers the Cloud Run deploy)"
git push origin main || fail "Push failed. See the message above."

echo
echo "${GREEN}${BOLD}✔ Pushed. Cloud Run is now building the new revision.${RESET}"
echo "It usually goes live within 5–10 minutes. Hard-refresh the site to see it."
echo
echo "   Live site:      $SITE_URL"
echo "   Build status:   $CLOUD_RUN_URL"
echo "   Commits:        $GITHUB_URL"
finish 0
