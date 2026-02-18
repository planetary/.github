# AI-Assisted Development Standards

**Status:** RFC (Request for Comments)
**Authors:** Hel Rabelo
**Requested by:** Josh Rubin, Chris Barna
**Date:** 2026-02-18

---

## Table of Contents

1. [Why We Need This](#1-why-we-need-this)
2. [Mental Models](#2-mental-models)
3. [Layered Configuration](#3-layered-configuration)
4. [Safety Rules (Non-Negotiable)](#4-safety-rules-non-negotiable)
5. [Code Quality Standards](#5-code-quality-standards)
6. [Gitignore Standards](#6-gitignore-standards)
7. [Commit & PR Standards](#7-commit--pr-standards)
8. [The AI Kit](#8-the-ai-kit)
9. [External Repos Strategy](#9-external-repos-strategy)
10. [Workflow Guides](#10-workflow-guides)
11. [What Comes Next](#11-what-comes-next)
12. [Appendix: Tool-Specific Notes](#12-appendix-tool-specific-notes)

---

## 1. Why We Need This

The team uses a growing mix of AI coding tools — Claude Code, Cursor, Copilot, and others. Each developer configures their tools independently, and there are no shared expectations for how AI-assisted work should be done.

This has already caused real problems:

- **Work-in-progress code was deleted** by an AI tool that decided to "clean up" uncommitted changes.
- **Code was claimed as working** when it had never been executed — tests were written but never run.
- **Code was pushed to a shared branch** without the developer asking for it.

These aren't hypothetical risks. They happened on our projects. And they'll happen more frequently as the team adopts more AI tools.

There's an additional challenge specific to Planetary: **many of our client projects live outside the Planetary GitHub organization.** We can't rely on org-level GitHub configurations or repo templates to enforce standards. We need an approach that travels with the developer, not the repository.

This RFC proposes a shared standard that is tool-agnostic, incident-informed, and practical for our agency workflow.

---

## 2. Mental Models

These are the shared mental models for how we think about AI-assisted development at Planetary. They're tool-agnostic — they apply whether you're using Claude Code, Cursor, Copilot, or anything else.

For more depth on these ideas, including detailed examples: [How I Actually Use Claude Code](https://www.helrabelo.dev/blog/how-i-actually-use-claude-code).

### The 70/30 Split

You provide 70% of the direction. The AI contributes 30% of the execution. The ratio isn't literal — it's a mindset. You are the architect, the reviewer, and the person accountable. The AI is an accelerator, not an autopilot.

When the ratio flips — when you're accepting code you don't understand, skipping reviews because "the AI wrote it," or trusting output you haven't verified — that's when incidents happen.

**What 70/30 looks like in practice:**
- You define the approach before asking the AI to implement it.
- You break the work into specific tasks, not "build the feature."
- You read and understand every line before committing.
- You make the architectural decisions; the AI handles the typing.

### The Junior Developer

Treat AI output the way you'd treat a pull request from a talented but inexperienced junior developer. They're fast, they're eager, and they produce code that *looks* right. But:

- They don't know the project's history or why things are done a certain way.
- They'll solve the wrong problem if the prompt is ambiguous.
- They'll over-engineer to show off instead of keeping it simple.
- They won't tell you when they're guessing — they'll present everything with the same confidence.

You wouldn't merge a junior's PR without reviewing it. You wouldn't let them push to main unsupervised. You wouldn't take their word that the code works without seeing it run. Same standard applies.

### Context Is the Product

The quality of AI output is directly proportional to the context you provide. A vague prompt produces vague code. A prompt with architecture context, file paths, naming conventions, and constraints produces code that fits.

This is why the AI Kit exists. Five minutes spent filling in a CLAUDE.md or .cursorrules file pays for itself on the first task. Without context, every AI interaction starts from zero — the tool makes wrong assumptions, uses wrong patterns, and you spend more time correcting than you saved.

**The hierarchy of context quality:**
1. **Project config file** (CLAUDE.md, .cursorrules) — persistent, automatic, covers the whole project.
2. **Task-specific prompt** — "Fix the z-index issue on the DTF mobile header, the header component is at `src/components/Header.tsx`."
3. **No context** — "Fix the header." This produces guesswork.

Invest in layers 1 and 2. Avoid layer 3.

### Small Bites

One task per prompt. One concern per commit. The moment you ask an AI tool to "build the whole feature," quality drops off a cliff.

Large, multi-step prompts lead to:
- Code you can't review effectively (too much to read)
- Interleaved concerns that should be separate commits
- Compounding errors where an early mistake cascades through everything
- Difficulty reverting when something goes wrong

**Break it down:**
- "Add the API route for location search" — then review, test, commit.
- "Add the autocomplete component that calls that route" — then review, test, commit.
- "Wire the autocomplete into the header" — then review, test, commit.

Three small, reviewable steps. Not one giant, unreviable blob.

### The Feedback Loop

Every AI interaction follows the same cycle: **prompt, review, refine, accept.**

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Prompt  │────▶│  Review  │────▶│  Refine  │────▶│  Accept  │
│          │     │          │     │          │     │          │
└──────────┘     └─────┬────┘     └──────────┘     └──────────┘
                       │                ▲
                       │  Not right     │
                       └────────────────┘
```

**Never skip "review."** The most common source of AI-related bugs is accepting output without reading it. The code looked plausible, the AI said it worked, so it went straight into a commit.

If you find yourself on the third round of "refine" for the same piece of code, that's the signal to stop and write it yourself. AI tools are great at first drafts. They're bad at nuanced iteration on the same code.

### Know When to Stop

AI tools are not always faster. Recognize these situations:

- **You're on round 3+ of corrections** for the same code block — write it yourself.
- **The task requires deep project context** that would take longer to explain than to just do — do it yourself.
- **The AI keeps making the same mistake** after clear corrections — it doesn't understand the constraint. Write it yourself.
- **The code is security-sensitive** (auth, payments, data handling) — write it yourself and use the AI to review, not generate.

Using AI tools well means knowing when *not* to use them. There's no shame in typing code manually. The goal is shipping good code, not maximizing AI usage.

### The Circular Saw

A circular saw makes a carpenter faster, not less careful. The safety guard doesn't slow the work down — it prevents the catastrophic mistake that ruins the project. Our safety rules are the guard.

These standards don't prescribe a specific tool. The principles are the same across all of them:

1. **You are accountable for every line of code** that reaches a PR, regardless of who or what wrote it.
2. **AI output is a draft**, never a finished product.
3. **Safety rules exist because of real incidents**, not theoretical concerns.
4. **Configuration should be explicit and portable**, not implicit and per-machine.

---

## 3. Layered Configuration

AI tools work best with layered context — each layer adding specificity. Here's how the layers work and what Planetary controls at each level.

| Layer | Scope | Who Owns It | Examples |
|-------|-------|-------------|----------|
| **1. Safety Rules** | All projects | Planetary (this RFC) | No destructive git, no untested claims |
| **2. Workspace Awareness** | Developer machine | Individual developer | Directory structure, tool paths |
| **3. Team Conventions** | All Planetary projects | Planetary (this RFC + AI Kit) | Commit format, PR template, code review expectations |
| **4. Project Context** | Single project | Project lead | Tech stack, key files, architecture, dev commands |
| **5. Session Memory** | Single session | Developer + AI tool | Current task, recent decisions |

**Layers 1 and 3** are what this RFC standardizes. **Layer 4** is what the [AI Kit templates](#8-the-ai-kit) help developers fill in per project. Layers 2 and 5 remain personal.

The key insight: Layers 1-3 should be consistent across the team. Layer 4 is where projects diverge. Layer 5 is ephemeral and shouldn't need standardization.

---

## 4. Safety Rules (Non-Negotiable)

These rules apply to every AI tool, every project, every developer. Each one exists because of a specific incident.

### Rule 1: No Destructive Git Operations Without Permission

**What happened:** An AI tool ran `git checkout -- .` to "fix" a build error, deleting all uncommitted work-in-progress code. Hours of work were lost.

**The rule:** AI tools must never run these commands without explicit developer approval:
- `git checkout --` (on any file)
- `git restore` (on any file)
- `git reset` (any form)
- `git clean`
- `git stash drop`
- `git push --force`

If the build fails, if there are merge conflicts, if changes seem problematic — the AI should **report the issue and ask**, not unilaterally discard work.

### Rule 2: Never Claim Untested Code Works

**What happened:** An AI tool stated code was "ready" and "complete" when it had never been executed. Tests were written but never run. The developer trusted the claim and submitted a PR with broken code.

**The rule:** AI tools must not claim code works unless it has been executed and verified. When presenting written code:
- State explicitly: "I have not tested this yet."
- Warn about assumptions: "This assumes [X] exists."
- If tests were written but not run, say so clearly.

Writing code is not the same as testing code. Writing tests is not the same as running tests.

### Rule 3: Never Push Without Permission

**What happened:** An AI tool pushed code to a shared branch without the developer asking for it, creating confusion for other team members.

**The rule:** AI tools must never push to remote repositories without the developer explicitly requesting it. This includes:
- `git push` (any form)
- Creating or closing PRs or issues
- Posting comments on PRs

The developer decides when code is ready for others to see.

### Rule 4: No AI Attribution in Commits or PRs

**Why:** Client repositories should not reference AI tools. Adding "co-authored by Claude" or "generated with AI" to commits in a client's codebase is unprofessional and may conflict with client expectations.

**The rule:** No AI attribution in commit messages, PR descriptions, or code comments. This includes:
- "Co-Authored-By: [AI tool]" in commits
- "Generated with [tool name]" in PR descriptions
- Comments like "// AI-generated" in code

The developer authors the code. The developer is accountable for it.

### Rule 5: No File Deletion Without Safe Backup

**What happened:** An AI tool deleted files that weren't tracked in git, assuming they were unnecessary. The files contained work that couldn't be recovered.

**The rule:** AI tools must not delete files or folders without:
1. Moving them to a safe location first (e.g., `/tmp` or `~/backup`)
2. Getting developer approval before permanent deletion
3. Being especially careful with files not tracked in git

---

## 5. Code Quality Standards

### Review All AI-Generated Code

Every line of AI-generated code must be reviewed before it enters a PR. This isn't optional — it's the same standard we'd apply to any contributor's code.

What to look for:
- **Does it do what you asked?** AI tools sometimes solve a slightly different problem than what was requested.
- **Is it correct?** Check logic, edge cases, and error handling.
- **Does it match the project's patterns?** AI tools often introduce inconsistent styles or patterns.
- **Is it minimal?** AI tools tend to over-engineer (see anti-patterns below).

### Build Validation Before Commits

Before creating any commit, run the project's build and type-checking commands. Do not commit code that has build or type errors.

```
# Example workflow
npm run build        # or the project's equivalent
tsc --noEmit         # if TypeScript
git add <files>
git commit
```

### Atomic Commits

Each meaningful change should be committed on its own. AI tools tend to accumulate large, multi-concern changesets. Break them up. Small, focused commits are easier to review and revert.

### Anti-Patterns to Watch For

AI tools consistently produce these anti-patterns. Be aware of them during review:

| Anti-Pattern | What It Looks Like | What to Do |
|-------------|-------------------|------------|
| **Over-engineering** | Adding abstractions, config options, or extensibility that wasn't requested | Remove it. Three similar lines are better than a premature abstraction. |
| **Doc sprawl** | Adding docstrings, comments, and type annotations to code that wasn't changed | Remove it. Only document code you're actually modifying. |
| **Placeholder tests** | Tests that look complete but don't actually test the right things, or mock everything away | Rewrite or remove. A test that can't fail isn't a test. |
| **Backwards-compat shims** | Renaming unused variables with `_`, re-exporting removed types, adding "// removed" comments | Delete the dead code completely. |
| **Phantom dependencies** | Importing or using APIs, selectors, or data shapes that don't exist in the codebase | Verify every import and API call against the actual codebase. |

---

## 6. Gitignore Standards

AI tools create configuration files that should not be committed to repositories. Add these entries to every project's `.gitignore`:

```gitignore
# AI tool configuration (developer-local, not committed)
.claude/
.cursor/
.cursorrules
.aider*
.continue/
.codeium/
.serena/
copilot-*
CLAUDE.md
AGENTS.md
ai-context.md
.temp/
```

A ready-to-copy version is available at [`templates/ai-kit/gitignore-ai.txt`](../templates/ai-kit/gitignore-ai.txt).

**Why gitignore these?** AI configuration is personal to each developer's setup and tool choice. Committing it would:
- Create merge conflicts as developers use different tools
- Expose internal workflow details in client repositories
- Make the repo opinionated about which AI tool to use

---

## 7. Commit & PR Standards

### Commits

We already use conventional commits. That doesn't change:

```
feat(DTF-123): add location search autocomplete
fix(WEL-45): correct header z-index on mobile
chore: update dependencies
```

**With AI tools, add these expectations:**

- **No AI attribution** in commit messages (see [Rule 4](#rule-4-no-ai-attribution-in-commits-or-prs)).
- **Build must pass** before committing (see [Build Validation](#build-validation-before-commits)).
- **Commits should be atomic** — one concern per commit. Don't let AI tools bundle unrelated changes.

### Pull Requests

Our existing [PR template](../.github/PULL_REQUEST_TEMPLATE.md) and [contributing guidelines](../CONTRIBUTING.md) apply unchanged. AI-assisted work has no special PR format.

The key addition: **the developer is responsible for the PR description.** If an AI tool drafted the description, the developer must review and edit it to accurately represent the change. Boilerplate or overly verbose AI-generated descriptions should be rewritten.

---

## 8. The AI Kit

The AI Kit is a set of starter templates that help developers configure their AI tools for Planetary projects. It's located at [`templates/ai-kit/`](../templates/ai-kit/).

### What's Included

| Template | For | Purpose |
|----------|-----|---------|
| [`CLAUDE.md.template`](../templates/ai-kit/CLAUDE.md.template) | Claude Code | Project configuration file |
| [`cursorrules.template`](../templates/ai-kit/cursorrules.template) | Cursor | Project rules file |
| [`ai-context.md.template`](../templates/ai-kit/ai-context.md.template) | Any tool | Tool-agnostic project context |
| [`gitignore-ai.txt`](../templates/ai-kit/gitignore-ai.txt) | All projects | Gitignore entries for AI files |

### How to Use It

1. **Copy the template** for your tool into the project root
2. **Rename it** (e.g., `CLAUDE.md.template` becomes `CLAUDE.md`)
3. **Fill in the project-specific sections** (dev commands, architecture, key files)
4. **Add the gitignore entries** to the project's `.gitignore`

Each template comes pre-filled with the safety rules from this RFC. The developer fills in the project-specific context. Five minutes of setup saves hours of correcting AI mistakes.

See the [AI Kit README](../templates/ai-kit/README.md) for detailed setup instructions.

---

## 9. External Repos Strategy

Many Planetary client projects live outside our GitHub organization. We can't control their repo settings, templates, or CI configurations. This is our biggest challenge for standardization.

### The Portable Approach

Our strategy: **make standards travel with the developer, not the repository.**

AI configuration files (CLAUDE.md, .cursorrules) are gitignored — they live locally on each developer's machine. The only thing that touches the client repo is `.gitignore` additions, which are standard housekeeping.

### Decision Matrix

| File | Committed to Client Repo? | Client Awareness Needed? |
|------|---------------------------|--------------------------|
| `.gitignore` additions | Yes | Minimal (standard housekeeping) |
| `CLAUDE.md` / `.cursorrules` | No (gitignored) | None |
| `ai-context.md` | Team decision | Only if committed |
| `.temp/` | No (gitignored) | None |

### Onboarding a New Client Project (5 minutes)

1. **Add gitignore entries.** Copy the contents of [`gitignore-ai.txt`](../templates/ai-kit/gitignore-ai.txt) into the project's `.gitignore`. Include this in your first PR — it's standard housekeeping.
2. **Copy your template.** Copy the appropriate template (CLAUDE.md, .cursorrules, or ai-context.md) to the project root and rename it.
3. **Fill in project context.** Spend a few minutes filling in the project-specific sections: dev commands, key files, architecture, conventions.

That's it. The AI configuration stays on your machine, the client repo stays clean, and you have the safety rules and project context you need.

### Fallback: Global Gitignore

If even `.gitignore` modifications aren't feasible for a specific client project (e.g., very strict change policies), developers can add the AI entries to their global gitignore:

```bash
# Add to ~/.gitignore_global
echo "CLAUDE.md" >> ~/.gitignore_global
echo ".claude/" >> ~/.gitignore_global
# etc.

# Ensure git uses it
git config --global core.excludesfile ~/.gitignore_global
```

This is a last resort — project-level gitignore is preferred because it protects all contributors, not just the one developer.

---

## 10. Workflow Guides

The mental models above describe *how to think*. These workflow guides describe *how to do*. Each one walks through a common development scenario step by step, applying the mental models to a concrete task.

| Guide | When to Use |
|-------|-------------|
| [AI-Assisted Bug Fix](../guides/ai-assisted-bug-fix.md) | Diagnosing and fixing a bug with AI assistance |
| [AI-Assisted Feature Build](../guides/ai-assisted-feature-build.md) | Building a new feature from ticket to PR |
| [AI-Assisted Code Review](../guides/ai-assisted-code-review.md) | Using AI as a review tool, not just a writing tool |
| [Onboarding to a Codebase](../guides/onboarding-to-a-codebase.md) | Using AI to understand an unfamiliar project |

These guides are opinionated starting points, not rigid procedures. Adapt them to the project and the situation.

---

## 11. What Comes Next

This is an RFC — a starting point for discussion, not a finished policy. Here's what needs to happen next.

### Discussion Points

- **Are the safety rules the right ones?** Are there incidents I'm not aware of that should inform additional rules?
- **Is the AI Kit practical?** Would you actually use these templates, or do they need to be different?
- **External repos strategy:** Does the portable approach work for all our client relationships, or are there cases I'm not considering?
- **Enforcement:** Should any of these standards be enforced through CI checks, or is documentation and team agreement sufficient?

### Proposed Rollout

If approved:

1. **Merge this RFC** as the canonical reference.
2. **Team walkthrough** — short session to introduce the standards and AI Kit.
3. **Pilot on 2-3 active projects** — apply the AI Kit, gather feedback.
4. **Iterate** based on real usage before declaring it "standard."

### Ongoing Maintenance

- **Quarterly review** of the standards to add new tools, update rules, and incorporate lessons learned.
- **This document is a living document.** PRs to update it follow the same review process as any other code change.

---

## 12. Appendix: Tool-Specific Notes

These notes help developers configure specific tools. The AI Kit templates handle most of this, but understanding the underlying mechanics is useful.

### Claude Code

- **Config file:** `CLAUDE.md` in the project root (also supports `~/.claude/CLAUDE.md` for global rules).
- **How it works:** Claude Code reads `CLAUDE.md` at the start of every session and treats its contents as persistent instructions.
- **Project memory:** Claude Code stores session memory in `.claude/` — this directory should be gitignored.
- **Key capability:** Claude Code can execute shell commands, which is why the destructive-git and push-without-permission rules are especially critical.

### Cursor

- **Config file:** `.cursorrules` in the project root, or files in `.cursor/` directory.
- **How it works:** Cursor reads `.cursorrules` and uses it as context for all AI interactions within the project.
- **Project settings:** Stored in `.cursor/` — this directory should be gitignored.

### GitHub Copilot

- **Config file:** `.github/copilot-instructions.md` for repository-level instructions.
- **How it works:** Copilot reads the instructions file and applies it to code completions and chat.
- **Limitation:** Copilot's instruction following is less precise than Claude Code or Cursor — safety rules should still be enforced through developer habits, not just tool configuration.

### Other Tools (Aider, Continue, Codeium, Windsurf)

- Each tool has its own config format. The [`ai-context.md.template`](../templates/ai-kit/ai-context.md.template) provides a tool-agnostic starting point.
- Safety rules must be adapted to each tool's configuration format.
- The gitignore entries in [`gitignore-ai.txt`](../templates/ai-kit/gitignore-ai.txt) already cover the common config files for these tools.
