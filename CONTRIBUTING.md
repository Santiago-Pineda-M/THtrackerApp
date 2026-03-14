# Contributing to TH Tracker

Welcome to the TH Tracker project! This document outlines the conventions, workflows, and best practices for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [GitFlow Workflow](#gitflow-workflow)
- [Conventional Commits](#conventional-commits)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Commit Message Format](#commit-message-format)
- [Scripts](#scripts)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git
- VSCode (recommended) or any IDE with TypeScript support

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/<your-username>/THtrackerApp.git
   cd THtrackerApp
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## Development Workflow

### Pre-commit Hooks

This project uses Husky and lint-staged to validate code before each commit. The following checks run automatically:

- **ESLint**: Lints and fixes code
- **Prettier**: Formats code
- **Vitest**: Runs related tests

### Commit Message Format

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

| Type       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation only changes                              |
| `style`    | Changes that don't affect code meaning (formatting)     |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding or updating tests                                |
| `chore`    | Changes to build process, dependencies, or tooling      |
| `ci`       | Changes to CI configuration                             |
| `build`    | Changes to build system or dependencies                 |
| `perf`     | Performance improvements                                |
| `revert`   | Reverts a previous commit                               |

#### Examples

```bash
# Feature
git commit -m "feat(auth): add login page component"

# Bug fix
git commit -m "fix(api): resolve token refresh issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(auth): simplify validation logic"

# Test
git commit -m "test(auth): add unit tests for login use case"
```

#### Rules

- Use lowercase for type and description
- Use imperative mood ("add" not "added" or "adds")
- Keep the subject line under 100 characters
- Reference issues in the footer when applicable:

  ```
  fix: resolve login timeout issue

  Closes #123
  ```

## GitFlow Workflow

This project follows the GitFlow branching model:

### Main Branches

| Branch    | Purpose                            | Protected |
| --------- | ---------------------------------- | --------- |
| `main`    | Production code                    | Yes       |
| `develop` | Integration branch for development | Yes       |

### Auxiliary Branches

| Branch Type | Purpose                 | Base Branch | Merge Target         |
| ----------- | ----------------------- | ----------- | -------------------- |
| `feature/*` | New features            | `develop`   | `develop`            |
| `bugfix/*`  | Bug fixes               | `develop`   | `develop`            |
| `release/*` | Release preparation     | `develop`   | `main` and `develop` |
| `hotfix/*`  | Urgent production fixes | `main`      | `main` and `develop` |

### Branch Naming

```
<type>/<issue-number>-<short-description>
```

Examples:

- `feature/123-user-authentication`
- `bugfix/456-login-error`
- `release/v1.0.0`
- `hotfix/789-security-patch`

## Pull Request Guidelines

### Before Creating a PR

1. **Run all validations**:

   ```bash
   npm run validate
   ```

   This runs:
   - TypeScript type checking (`npm run type-check`)
   - ESLint validation (`npm run lint`)
   - Unit tests (`npm run test`)

2. **Ensure all tests pass**:

   ```bash
   npm run test
   ```

3. **Format your code**:

   ```bash
   npm run format
   ```

4. **Update documentation** if needed

### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe testing performed

## Checklist

- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No linting errors
- [ ] All checks pass
```

### PR Review Process

1. Create a pull request to `develop` (for features/bugfixes) or `main` (for hotfixes)
2. All CI/CD checks must pass
3. At least one approval required
4. All conversations must be resolved
5. Branch must be up to date with target branch

## Code Quality

### TypeScript

- Strict mode enabled
- All functions must have type annotations for parameters and return types
- Use interfaces over types for object shapes

### ESLint

We use ESLint with React and TypeScript configurations. Run linting:

```bash
npm run lint
```

Auto-fix linting errors:

```bash
npm run lint:fix
```

### Prettier

Code is formatted with Prettier. Format all files:

```bash
npm run format
```

Check formatting without modifying files:

```bash
npm run format:check
```

### TypeScript Type Checking

```bash
npm run type-check
```

## Testing

### Running Tests

Run all tests once:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Writing Tests

- Place tests in `__tests__/` directory
- Follow naming convention: `*.test.ts` or `*.test.tsx`
- Use Vitest as the testing framework
- Aim for meaningful test descriptions

Example:

```typescript
describe('LoginUseCase', () => {
  it('should return tokens on successful login', async () => {
    // Arrange
    const useCase = new LoginUseCase(mockAuthService);

    // Act
    const result = await useCase.execute(validCredentials);

    // Assert
    expect(result.accessToken).toBeDefined();
  });
});
```

## Scripts

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start development server              |
| `npm run build`         | Build for production                  |
| `npm run build:prod`    | Full production build with all checks |
| `npm run lint`          | Run ESLint                            |
| `npm run lint:fix`      | Fix ESLint errors                     |
| `npm run type-check`    | TypeScript type checking              |
| `npm run test`          | Run tests once                        |
| `npm run test:watch`    | Run tests in watch mode               |
| `npm run test:coverage` | Run tests with coverage               |
| `npm run validate`      | Run all validations                   |
| `npm run format`        | Format code with Prettier             |
| `npm run format:check`  | Check code formatting                 |

## CI/CD Pipeline

Every push and pull request triggers the CI/CD pipeline which runs:

1. **Lint & Type Check**: ESLint and TypeScript validation
2. **Unit Tests**: Vitest test execution
3. **Build**: Production build
4. **Commit Validation**: Conventional commits check

All checks must pass before merging to protected branches.

## Questions?

If you have questions, please open an issue or reach out to the maintainers.

Thank you for contributing!
