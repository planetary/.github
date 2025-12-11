# AI Usage Guidelines

> Part of [Planetary Agency Standards](../STANDARDS.md)

---

## AI Workspace Setup

### Required .gitignore Entries

All projects must include these entries in `.gitignore` to prevent AI-related files from being committed:

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

### .temp/ Folder Convention

Use `.temp/` for AI-generated scratch files, experiments, and temporary outputs:

```
project/
├── .temp/                  # Gitignored - AI scratch space
│   ├── experiments/        # Code experiments
│   ├── drafts/            # Draft implementations
│   └── notes/             # AI conversation context
├── CLAUDE.md              # Gitignored - Project AI instructions
└── ...
```

**What goes in .temp/**:
- Experimental code before it's ready for review
- Draft implementations being iterated on
- Temporary test files
- AI-generated boilerplate before cleanup
- Research notes and context

**Never commit .temp/ contents** - it's for local AI-assisted development only.

---

## When AI is Helpful ✅

### Code Generation
- Boilerplate code (components, pages, API routes)
- TypeScript types and interfaces
- Sanity schemas
- Utility functions

### Problem Solving
- Debugging complex issues
- Performance optimization suggestions
- Accessibility improvements
- Cross-browser compatibility fixes

### Documentation (Selective)
- Inline code comments for complex logic
- JSDoc for public APIs
- README setup instructions

---

## When AI Creates Problems ❌

### Documentation Overload
```
❌ DON'T: Generate excessive .md files
project/
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── DEVELOPMENT.md
├── TESTING.md
├── DEPLOYMENT.md
├── TROUBLESHOOTING.md
└── docs/
    ├── components/
    │   ├── Button.md
    │   ├── Card.md
    │   └── ... (20+ more)
    └── ...

✅ DO: Keep it minimal
project/
├── README.md           # Setup, commands, environment
└── CLAUDE.md          # Project-specific notes for AI (gitignored)
```

### Over-Commenting
```typescript
❌ DON'T: Comment obvious code
// This function adds two numbers together
function add(a: number, b: number): number {
  // Return the sum of a and b
  return a + b
}

✅ DO: Comment complex logic only
// Apply exponential backoff for rate-limited API calls
// Retries: 1s, 2s, 4s, 8s, then fails
async function fetchWithRetry(url: string, maxRetries = 4) {
  // ...complex retry logic
}
```

### Generic Test Files
```typescript
❌ DON'T: Generate placeholder tests
describe('Button', () => {
  it('should render', () => {
    expect(true).toBe(true) // Placeholder
  })
})

✅ DO: Write meaningful tests or skip tests
// Only add tests for:
// - Complex business logic
// - Critical user flows
// - Bug reproductions
```

---

## AI Best Practices

### Rule #1: Review Every AI-Generated Change
- Don't blindly accept AI suggestions
- Understand the code before committing
- Check for over-engineering

### Rule #2: Prefer Editing Over Creating
- Start with existing project patterns
- Ask AI to match existing code style
- Avoid introducing new patterns unnecessarily

### Rule #3: Simplicity Over Cleverness
```typescript
❌ AI might suggest:
const isEven = (n: number) => !(n & 1)

✅ Prefer readable code:
const isEven = (n: number) => n % 2 === 0
```

### Rule #4: Delete AI-Generated Boilerplate
- Remove generic comments
- Delete placeholder documentation
- Remove unused imports/functions
- Clean up verbose error messages

### Rule #5: Use AI for Initial Drafts, Human for Final Polish
```
1. AI generates component structure
2. Human reviews and simplifies
3. Human adds project-specific logic
4. Human tests thoroughly
5. Human commits with meaningful message
```

---

## AI Tools We Use

- **GitHub Copilot**: Code autocomplete (optional per developer)
- **Claude Code**: Complex refactoring and architecture questions
- **ChatGPT/Claude Web**: Quick problem solving, not for generating entire files

---

## AI Anti-Patterns to Avoid

### ❌ Asking AI to Generate Entire Projects
- Results in generic, non-specific code
- Doesn't follow our patterns
- Creates maintenance burden

### ❌ Letting AI Write Git Commits
- Generic commit messages like "Updated files"
- No context or reasoning
- Violates our commit standards

### ❌ AI-Generated Documentation Sprawl
- Hundreds of markdown files
- Outdated immediately after creation
- Nobody reads them
- Clutter the repo

### ❌ Copy-Paste Without Understanding
- Security vulnerabilities
- Performance issues
- Doesn't fit project architecture
- Technical debt

### ✅ Use AI as a Pair Programming Partner
- Discuss approach first
- Let AI draft implementation
- Review and refine together
- Learn from the suggestions
