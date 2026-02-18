# Workflow: AI-Assisted Code Review

Using AI as a review tool — to catch issues, understand unfamiliar code, and strengthen your reviews.

**Mental models applied:** [The Junior Developer](../standards/ai-assisted-development.md#the-junior-developer), [The 70/30 Split](../standards/ai-assisted-development.md#the-7030-split)

---

## Why Use AI for Reviews?

AI tools are surprisingly good at catching things humans miss during review:

- **Inconsistencies** — the code uses a different pattern than the rest of the codebase
- **Missing edge cases** — null checks, empty arrays, error paths
- **Naming issues** — variables that don't match conventions or are misleading
- **Logic bugs** — off-by-one errors, wrong comparisons, inverted conditions

They're less good at:

- **Evaluating architecture** — whether the approach is right for the project
- **Understanding intent** — whether the code solves the actual problem
- **Assessing user experience** — whether the feature makes sense
- **Judging necessity** — whether the code should exist at all

Use AI for what it's good at. Rely on yourself for the rest.

---

## The Workflow

### As a Reviewer: Using AI to Assist Your Review

#### Step 1: Read the PR Description and Ticket First

Understand what the PR is supposed to do before looking at any code. This applies whether or not you use AI — but it's especially important because AI tools will analyze code in isolation if you don't give them the context of *why* the code exists.

#### Step 2: Do Your Own Pass First

Read through the changes yourself. Form your own opinions. Note anything that seems off, confusing, or worth discussing.

Why first? If you let the AI review first, you'll anchor on its findings and stop looking for things it didn't flag. Your judgment is the primary review. AI is supplementary.

#### Step 3: Ask the AI for a Second Pass

After your own review, use the AI to check for things you might have missed:

```
"Review this diff for potential issues. Focus on:
- Logic errors or missing edge cases
- Inconsistencies with common Next.js/React patterns
- Error handling gaps
- Anything that looks like it could break in production"

[paste the diff or point to the files]
```

#### Step 4: Evaluate the AI's Findings

The AI will flag things. Some will be valid catches. Some will be noise. For each finding:

- **Is this a real issue?** Or is the AI being overly cautious?
- **Does this apply to our project?** The AI might flag something that's actually an intentional pattern here.
- **Is this actionable?** "Consider adding error handling" is vague. "This fetch call has no catch block and will crash the page if the API is down" is actionable.

Only raise findings in your review if you agree they're valid after your own evaluation.

### As an Author: Using AI to Self-Review

#### Before Opening the PR

Use the AI to review your own changes before requesting review from a teammate:

```
"Review my changes in these files for issues before I open a PR.
The feature is [what it does]. Check for:
- Bugs or logic errors
- Missing error handling
- Inconsistencies with the existing code patterns
- Anything I might have overlooked"
```

This catches the obvious stuff before a human reviewer has to point it out. It's like running a linter for logic and patterns.

#### What to Do With the Results

- Fix genuine issues immediately.
- Ignore stylistic suggestions that don't match the project's patterns.
- If the AI suggests a "better approach" for code that already works and is clear — ignore it. Don't refactor working code based on AI suggestions during a PR.

---

## Prompts That Work Well for Reviews

**Catch missing error handling:**
```
"What happens in this code if the API returns a 500?
What if the response body is empty? What if the network times out?"
```

**Check for consistency:**
```
"Compare this component's patterns (state management, data fetching, error handling)
with [existing similar component]. Are there inconsistencies?"
```

**Understand unfamiliar code:**
```
"Explain what this function does step by step. I want to understand the logic
before I review whether it's correct for our use case."
```

**Check for regressions:**
```
"This PR changes the auth middleware. What existing behavior could this break?
What should I test manually to verify nothing regressed?"
```

---

## What AI Reviews Can't Replace

- **Running the code.** The AI hasn't run it. Neither has a human reviewer who only reads the diff. Actually test the PR.
- **Understanding the product.** Does this feature make sense for the user? That's a human judgment call.
- **Evaluating the approach.** Should this be a client component or a server component? Should this use the existing API or create a new one? Architecture decisions need a human.
- **Knowing the team context.** "We tried this approach last sprint and it didn't work because..." — AI doesn't have that history.
