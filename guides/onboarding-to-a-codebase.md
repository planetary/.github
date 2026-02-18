# Workflow: Onboarding to a Codebase With AI

Using AI tools to quickly understand an unfamiliar project — how it's structured, how it works, and where to start.

**Mental models applied:** [Context Is the Product](../standards/ai-assisted-development.md#context-is-the-product), [The 70/30 Split](../standards/ai-assisted-development.md#the-7030-split)

---

## When This Applies

- You're picking up a client project you haven't worked on before
- You're returning to a project after months away
- You're reviewing a PR in an unfamiliar area of the codebase
- You're onboarding a new team member and want to accelerate their ramp-up

---

## The Workflow

### Step 1: Start With the Basics (Manual)

Before involving the AI, get oriented:

```bash
# What's in the repo?
ls -la

# What's the tech stack?
cat package.json    # or go.mod, requirements.txt, etc.

# Is there a README?
cat README.md

# Is there an existing AI config?
cat CLAUDE.md 2>/dev/null || cat .cursorrules 2>/dev/null || echo "No AI config found"
```

Spend 5 minutes reading the README, checking the package.json, and understanding the basic project structure. This gives you enough context to ask useful questions.

### Step 2: Map the Architecture

Ask the AI to help you build a mental map:

```
"I'm new to this project. Based on the directory structure and
package.json, give me a high-level overview:
- What framework and major libraries does it use?
- How is the code organized? (pages, components, lib, etc.)
- Where does data come from? (CMS, API, database)
- How is routing handled?
- What's the deployment target?"
```

Then verify the AI's claims by spot-checking a few files it mentions. AI tools sometimes misidentify architecture, especially with newer frameworks.

### Step 3: Trace a Feature

Pick one feature that's relevant to your task and trace it through the codebase:

```
"Walk me through how the location search works in this project.
Start from the user clicking the search bar through to results being displayed.
Which files are involved at each step?"
```

This is more useful than reading every file. You understand one complete flow, and that pattern usually applies to others.

### Step 4: Identify Patterns and Conventions

```
"What patterns does this project follow for:
- Data fetching (client-side, server-side, or both?)
- State management
- Component structure (how are components organized?)
- Error handling
- Styling (CSS modules, Tailwind, styled-components?)

Show me one example of each from the actual codebase."
```

This tells you what "good code" looks like *in this specific project*, which matters more than general best practices when you're contributing to an existing codebase.

### Step 5: Set Up Your AI Config

Now that you understand the project, create your AI configuration file. Use the [AI Kit templates](../templates/ai-kit/):

1. Copy the template for your tool (CLAUDE.md, .cursorrules, etc.)
2. Fill in what you've just learned: dev commands, architecture, key files, conventions
3. Add the gitignore entries if they're not already there

This investment pays off immediately — every subsequent AI interaction will have the project context baked in.

### Step 6: Find Your Starting Point

```
"I need to work on [your task]. Based on the codebase structure and patterns,
which files will I likely need to modify? What existing code should I read first
to understand how to approach this?"
```

This gives you a focused reading list instead of trying to understand the entire codebase at once.

---

## Tips for Effective Onboarding

**Ask "show me" not "tell me."** Instead of "how does auth work?" ask "show me the auth middleware and the login page — which files are they in?" Concrete references are more useful than explanations.

**Verify claims.** AI tools sometimes hallucinate file paths or misidentify patterns. When the AI says "the data fetching pattern uses X," open the file and confirm it.

**Build incrementally.** Don't try to understand the whole codebase in one session. Understand what's relevant to your current task. The rest will come as you work on more tasks.

**Write down what you learn.** If you created a CLAUDE.md or .cursorrules, you've already done this. But also consider adding notes to the project's README or internal docs if you discovered things that would help the next person.

---

## What AI Onboarding Can't Replace

- **Talking to the previous developer.** AI can tell you *what* the code does. It can't tell you *why* a weird pattern exists, what was tried and rejected, or what the known gotchas are. A 15-minute conversation with someone who's worked on the project is worth hours of AI-assisted exploration.
- **Running the project.** Get it running locally. Click through it. Understanding behavior from code alone is incomplete.
- **Reading the ticket history.** The project's Linear/Jira history tells you what changed recently, what's been problematic, and what the priorities are. AI tools don't have this context.
