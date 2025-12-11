# Planetary Agency Standards

> **Last Updated**: 2025-12-11
> **Status**: Draft - Awaiting Final Approval
> **Owner**: Director of Technology (Chris)

---

## Quick Links

| Standard | Description |
|----------|-------------|
| [Git Workflow](./standards/git-workflow.md) | Branches, commits, PRs, repository organization |
| [Package Management](./standards/package-management.md) | Dependencies, lock files, audit schedule |
| [Analytics & Marketing](./standards/analytics-marketing.md) | GTM, consent management, SEO |
| [Performance & Caching](./standards/performance-caching.md) | Core Web Vitals, caching strategies, CDN |
| [Testing](./standards/testing.md) | Playwright, CI/CD, coverage goals |
| [Tooling](./standards/tooling.md) | ESLint, Prettier, TypeScript, Storybook |
| [Project Structure](./standards/project-structure.md) | Monorepo layout, component organization |
| [AI Usage](./standards/ai-usage.md) | AI guidelines, .gitignore for AI files, best practices |
| [Configuration](./standards/configuration.md) | Environment variables, config files |
| [Deployment](./standards/deployment.md) | Vercel, pre-deploy checklist |

---

## Essential Standards Summary

### Git Commits
```bash
feat: add product filtering to catalog page
fix: resolve mobile menu overflow on iPad
chore: upgrade next.js to 15.5
```
- **NEVER** add co-author lines or "Generated with Claude Code"
- **NEVER** add "claude" to commit messages

### .gitignore (AI Files)
All projects must ignore AI-related files:
```gitignore
# AI Agent Files
.temp/
CLAUDE.md
.claude/
.cursor/
.aider*
.continue/
copilot-*
.serena/
.codeium/
```

### Core Web Vitals Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Lighthouse: ≥90

### Required Tools
- ESLint + Prettier
- TypeScript (strict mode)
- `npm ci` in CI/CD

### Deployment
- All projects on Vercel
- `main` → Production
- PRs → Preview deployments

---

## Questions or Feedback?

**For Standards Questions**:
- Create issue in `planetary/.github` repo
- Tag @lead-engineer or @director-tech
- Discuss in #engineering Slack channel

**For Project-Specific Implementation**:
- Create Linear ticket in project board
- Reference this standards doc
- Tag appropriate team members

---

## Changelog

### 2025-12-11 - Documentation Restructure
- Split monolithic STANDARDS.md into focused sub-documents
- Added AI workspace guidelines (.temp folder, .gitignore standards)
- Improved navigation with quick links table

### 2025-12-03 - Initial Draft
- Comprehensive analysis of 4 existing projects
- Standards created based on current best practices
- Prioritization based on security (Sanity V4) and business impact
- Feedback incorporated from initial review

---

**Document Status**: Draft awaiting approval
**Next Review**: After initial feedback
