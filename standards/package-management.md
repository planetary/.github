# Package Management Standards

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## Dependency Audit Schedule

### Weekly (Automated via Dependabot or GitHub)
- Security patches for critical vulnerabilities
- Review and merge automated PRs

### Monthly
- Minor version updates for key dependencies
- Review changelog for breaking changes
- Test thoroughly before merging

### Quarterly
- Major version updates (Next.js, React, Sanity)
- Plan migration path
- Allocate dedicated time for testing

### Commands to Run
```bash
# Check for security vulnerabilities
npm audit

# See outdated packages
npm outdated

# Update package-lock.json without changing package.json
npm update

# Interactive update (recommended)
npx npm-check-updates -i
```

---

## Lock File Standards

**Always Use**: `package-lock.json` (npm)

### Rules
- ✅ Commit `package-lock.json` to Git
- ✅ Use `npm ci` in CI/CD (Vercel) for reproducible builds
- ✅ Use `npm install` locally for development
- ❌ Never delete `package-lock.json` to "fix" issues
- ❌ Never mix package managers (no yarn.lock or pnpm-lock.yaml)

### When Lock File Conflicts Occur
```bash
# 1. Pull latest from main
git pull origin main

# 2. Reinstall to resolve conflicts
rm -rf node_modules package-lock.json
npm install

# 3. Commit resolved lock file
git add package-lock.json
git commit -m "chore: resolve package-lock.json conflicts"
```
