# Workflow: AI-Assisted Bug Fix

From bug report to fix to commit — using AI tools effectively for debugging.

**Mental models applied:** [Small Bites](../standards/ai-assisted-development.md#small-bites), [The Feedback Loop](../standards/ai-assisted-development.md#the-feedback-loop), [Know When to Stop](../standards/ai-assisted-development.md#know-when-to-stop)

---

## The Workflow

### Step 1: Understand the Bug First (You, Not the AI)

Read the ticket. Reproduce the bug. Understand what's expected vs. what's happening. **Do this before involving the AI tool.**

Why: If you paste a vague bug report into an AI tool, you'll get a vague fix. The AI doesn't have the context of how the feature is supposed to behave, what changed recently, or what the user actually experienced.

### Step 2: Narrow the Scope

Before asking the AI anything, narrow down:

- **Where** in the codebase the bug likely lives (which file, which component, which route)
- **What** the expected behavior is
- **What** the actual behavior is
- **When** it started (if you know — a recent deploy, a specific PR)

The more specific your starting point, the better the AI's output.

### Step 3: Investigate With the AI

Now bring in the AI tool. Use it to explore, not to fix — not yet.

**Good prompts at this stage:**

```
"Read src/components/Header.tsx and src/hooks/useNavigation.ts.
The mobile hamburger menu doesn't close when navigating to a new page.
It works on desktop. What could cause this?"
```

```
"The location search returns 0 results on staging but works locally.
The API route is at src/app/api/locations/route.ts.
What differences between environments could cause this?"
```

**Bad prompts at this stage:**

```
"Fix the bug."
"The menu is broken, fix it."
```

### Step 4: Confirm the Diagnosis

The AI will suggest a cause. Before accepting it:

- Does the explanation match what you observed?
- Can you verify the theory? (Add a console.log, check the network tab, inspect state.)
- Does the AI's understanding of the code match reality? (AI tools sometimes misread code flow.)

If the diagnosis doesn't feel right, provide corrections and ask again. If the AI keeps circling, investigate manually — this is a "know when to stop" moment.

### Step 5: Implement the Fix (Small Bite)

Once you're confident in the diagnosis, ask for the fix. Be specific:

```
"The issue is that the mobile menu state isn't being reset on route change.
In src/components/MobileMenu.tsx, add a useEffect that closes the menu
when the pathname changes. Use the existing setIsOpen(false) function."
```

Not:

```
"OK fix it."
```

### Step 6: Review the Fix

Read the code the AI produced. Check:

- Does it fix the actual bug, or a different problem?
- Does it introduce side effects?
- Does it match the project's existing patterns?
- Is it minimal? (AI tools love adding "while we're here" improvements — reject those.)

### Step 7: Verify and Commit

```bash
# Run the build
npm run build

# Test the fix manually — reproduce the original bug, confirm it's gone

# Run tests if they exist for this area
npm test

# Commit just the fix
git add src/components/MobileMenu.tsx
git commit -m "fix(DTF-89): close mobile menu on route change"
```

---

## When to Stop Using the AI

Switch to manual debugging if:

- The AI suggests fixes that don't address the root cause after 2 attempts
- The bug involves timing, race conditions, or environment-specific behavior that the AI can't observe
- The AI doesn't understand the project's state management or data flow despite context
- You've spent more time explaining the bug to the AI than it would take to just read the code yourself

## Common Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| Accepting the first suggested fix without verifying the diagnosis | Always confirm the root cause before implementing a fix |
| Letting the AI "clean up" surrounding code while fixing the bug | Reject unrelated changes — the commit should only contain the fix |
| Trusting the AI when it says "this should fix it" | The AI hasn't run the code. Verify the fix yourself. |
| Providing the bug report verbatim as the prompt | Translate the bug report into specific technical context first |
