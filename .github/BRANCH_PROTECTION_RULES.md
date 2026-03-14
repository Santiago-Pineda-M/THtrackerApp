# GitHub Branch Protection Rules

## Overview

This document describes the branch protection rules configured for this repository. These rules ensure code quality and prevent direct commits to protected branches.

## Protected Branches

### main

- **Purpose**: Production-ready code
- **Protection Rules**:
  - Require pull request reviews (1 approval required)
  - Require status checks to pass before merging
  - Require conversation resolution before merging
  - Require branches to be up to date before merging
  - Include administrators in protection rules
  - Restrict who can push
    - Allowed to push: None (force push disabled)
    - Require signed commits: Disabled
    - Require linear history: Enabled

### develop

- **Purpose**: Integration branch for development
- **Protection Rules**:
  - Require pull request reviews (1 approval required)
  - Require status checks to pass before merging
  - Require conversation resolution before merging
  - Require branches to be up to date before merging
  - Include administrators in protection rules
  - Restrict who can push
    - Allowed to push: None (force push disabled)
    - Require linear history: Enabled

## Branch Naming Conventions

All branch names must follow these patterns:

| Branch Type | Pattern                                | Example                     |
| ----------- | -------------------------------------- | --------------------------- |
| Feature     | `feature/<issue-number>-<description>` | `feature/123-user-auth`     |
| Bugfix      | `bugfix/<issue-number>-<description>`  | `bugfix/456-login-fix`      |
| Release     | `release/v<version>`                   | `release/v1.0.0`            |
| Hotfix      | `hotfix/<issue-number>-<description>`  | `hotfix/789-security-patch` |

## Status Checks Required

Before merging to `main` or `develop`, all following checks must pass:

1. **Lint & Type Check** (`lint-and-typecheck`)
   - ESLint validation
   - TypeScript type checking

2. **Unit Tests** (`test`)
   - All Vitest tests must pass
   - Test coverage requirements: None (all tests must pass)

3. **Build** (`build`)
   - Production build must complete successfully

4. **Commit Validation** (`commitlint`)
   - All commit messages must follow Conventional Commits

## How to Configure

### Via GitHub UI

1. Go to **Settings** > **Branches**
2. Click **Add rule** for `main`
3. Configure the following:
   - [x] Require pull request reviews before merging
   - [x] Require status checks to pass before merging
   - [x] Require conversation resolution before merging
   - [x] Require branches to be up to date before merging
   - [x] Include administrators
   - [x] Restrict who can push
4. Select required status checks:
   - `lint-and-typecheck`
   - `test`
   - `build`
5. Repeat for `develop` branch

### Via GitHub CLI

```bash
# Protect main branch
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  -f required_status_checks='{"strict":true,"contexts":["lint-and-typecheck","test","build"]}' \
  -f required_pull_request_reviews='{"required_approving_review_count":1}' \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f require_linear_history=true

# Protect develop branch
gh api repos/{owner}/{repo}/branches/develop/protection \
  --method PUT \
  -f required_status_checks='{"strict":true,"contexts":["lint-and-typecheck","test","build"]}' \
  -f required_pull_request_reviews='{"required_approving_review_count":1}' \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f require_linear_history=true
```

## Workflow Examples

### Feature Development Workflow

```bash
# 1. Create feature branch from develop
git checkout -b feature/123-new-login

# 2. Make changes and commit (following Conventional Commits)
git commit -m "feat: add login form component"

# 3. Push branch
git push -u origin feature/123-new-login

# 4. Create Pull Request to develop
# PR will trigger CI/CD pipeline
# All checks must pass before merge

# 5. After approval and passing checks, merge to develop
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout -b hotfix/789-urgent-fix

# 2. Make changes and commit
git commit -m "fix: resolve critical security issue"

# 3. Create Pull Request to main
# Must pass all checks
# After merge, cherry-pick to develop
```
