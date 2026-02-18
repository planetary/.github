# Planetary AI Kit

Starter templates for configuring AI coding tools on Planetary projects.

These templates embed the [safety rules and standards](../../standards/ai-assisted-development.md) so you don't have to remember them — your AI tool reads them automatically at the start of every session.

## Quick Setup (5 minutes)

### Step 1: Add gitignore entries

Copy the contents of [`gitignore-ai.txt`](gitignore-ai.txt) into your project's `.gitignore`. This prevents AI config files from being committed to the repo.

Include this in your first PR — it's standard housekeeping.

### Step 2: Copy the right template

| If you use... | Copy this file | Rename to |
|---------------|---------------|-----------|
| Claude Code | [`CLAUDE.md.template`](CLAUDE.md.template) | `CLAUDE.md` |
| Cursor | [`cursorrules.template`](cursorrules.template) | `.cursorrules` |
| Other tools | [`ai-context.md.template`](ai-context.md.template) | `ai-context.md` |

Copy the template to your **project root** and rename it.

### Step 3: Fill in project context

Open the template and fill in the project-specific sections:

- Dev commands (install, dev, build, test)
- Architecture (framework, routing, state management)
- Key files and directories
- Environment variables (names only, not values)
- Project conventions

The safety rules are already filled in. Don't remove them.

## FAQ

**Do I need client approval to use this?**
No. The AI config files are gitignored — they never enter the client repo. The only change to the repo is `.gitignore` additions, which is standard housekeeping.

**My tool isn't listed. What do I use?**
Start with `ai-context.md.template`. It's tool-agnostic and can be adapted to any tool's config format. The safety rules section is what matters most.

**Should I commit the AI config file?**
No. AI config files are gitignored by default. They're personal to your tool and setup. If your team wants to share project context, the `ai-context.md` file can be committed by team decision — but discuss it first.

**Can I customize the safety rules?**
The safety rules are non-negotiable — they exist because of real incidents. You can add project-specific rules (e.g., "never modify the payment module without review"), but don't remove the base rules.

**I'm using multiple AI tools. Do I need multiple config files?**
Use the config file for your primary tool. The gitignore entries cover all common tools, so switching between them won't leave config files in the repo.

## Templates Reference

| File | Purpose |
|------|---------|
| [`CLAUDE.md.template`](CLAUDE.md.template) | Claude Code project configuration |
| [`cursorrules.template`](cursorrules.template) | Cursor project rules |
| [`ai-context.md.template`](ai-context.md.template) | Tool-agnostic project context |
| [`gitignore-ai.txt`](gitignore-ai.txt) | Gitignore entries for AI tool files |

## Full Standards

For the complete rationale, philosophy, and external repo strategy, see the [AI-Assisted Development Standards](../../standards/ai-assisted-development.md).
