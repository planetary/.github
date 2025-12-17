# Git Workflow Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Repository Organization

### Client-Owned Repos
```
github.com/client-org/project-name
Examples:
- github.com/dintaifung/dtf-website
- github.com/burlington/burlington-com
```
- We have contributor access
- Client owns the repo
- Follow client's access policies

### Planetary-Owned Repos
```
github.com/planetary-agency/project-name
Examples:
- github.com/planetary-agency/177milkstreet
- github.com/planetary-agency/planetary-website
```
- We own and manage
- Full admin access
- We control deployment

---

## Branch Strategy

### Standard Branch Names
```
main              # Production branch (protected)
staging           # Staging environment (if applicable)
develop           # Development branch (some projects)

feature/LINEAR-123-brief-description
fix/LINEAR-456-brief-description
hotfix/LINEAR-789-brief-description
deps/update-nextjs
```

### Branch Protection Rules (for Planetary-owned repos)
- `main` requires PR approval from Lead Engineer or Director
- No direct commits to `main`
- Status checks must pass (lint, type check, build)
- Delete branches after merge

---

## Commit Standards

### Conventional Commits Format
```
<type>: <description>

[optional body]

[optional issue reference]
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance (deps, config)
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code change that neither fixes bug nor adds feature
- `perf:` - Performance improvement
- `test:` - Adding or updating tests

### Examples
```bash
# Good
git commit -m "feat: add product filtering to catalog page"
git commit -m "fix: resolve mobile menu overflow on iPad"
git commit -m "chore: upgrade next.js to 15.5"

# Bad (avoid)
git commit -m "update"
git commit -m "fix stuff"
git commit -m "WIP"
```

### Commit Body Guidelines
- Keep commits focused (one logical change per commit)
- First line max 72 characters
- Use present tense ("add feature" not "added feature")
- Reference issues: `Closes #123` or `Closes PROJ-123`
- **NEVER** add co-author lines or "Generated with Claude Code"
- **NEVER** add "claude" to commit messages

---

## Pull Request Standards

### Standard PR Template
We use the shared template from `https://github.com/planetary/.github`

### PR Title Format
```
[TEAM-123] Brief description of changes
```

### Our PR Template Includes
- **Ticket**: Link to related issue
- **Summary**: Problem, Solution, How it works
- **Testing/QA Steps**: Step-by-step verification instructions
- **Acceptance Criteria**: Definition of "done"
- **Author Checklist**: Self-review items

### PR Review Process
1. Create PR and assign to Lead Engineer or senior developer
2. Ensure CI passes (build, lint, type check)
3. Address review comments
4. Get approval
5. **Reviewer merges** (not PR author)
6. Delete branch after merge

### PR Size Guidelines
- Small PRs preferred (< 400 lines changed)
- If larger, explain why in description
- Break up large features into multiple PRs when possible
