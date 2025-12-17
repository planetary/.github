# Contributing Guidelines

## Core Principles

- **Every change goes through a PR before merge.** No direct commits to main.
- **PRs must be understandable on their own.** No meeting or DM should be required to understand what was done.
- **If a reviewer can't understand a PR, it's not complete.** The author needs to improve the description or have a conversation.

---

## For Authors

### Before Opening a PR

1. **Self-review your code.** Read through your changes as if you were the reviewer.
2. **Test locally.** Verify the change works as expected.
3. **Write tests.** Add or update tests where appropriate.

### Writing a Good PR Description

Every PR must include:

| Section | What to include |
|---------|-----------------|
| **Ticket link** | Link to the related issue |
| **Summary** | The problem, what you changed, and how the solution works |
| **Testing steps** | Exact steps to verify the change, including accounts/URLs if relevant |
| **Acceptance criteria** | What "done" means for this change |

**Tips:**
- Explain the "why" not just the "what"
- Include context a reviewer needs to understand the change
- If it's a complex change, add a high-level explanation of the approach
- Screenshots or recordings help for UI changes

### When Your PR Needs a Conversation

If your PR is too complex to explain in writing, that's a sign you might need to:
- Break it into smaller PRs
- Schedule a brief walkthrough with a reviewer
- Add more detailed documentation

But the PR description should still be complete—a conversation supplements, it doesn't replace documentation.

---

## For Reviewers

### Before Reviewing Code

1. **Read the ticket.** Understand the context and requirements.
2. **Read the PR description.** Understand the approach before looking at code.

### During Review

1. **Follow the testing steps.** Actually test the change, don't just skim code.
2. **Verify acceptance criteria.** Confirm the change meets the defined "done" state.
3. **Ask questions.** If anything is unclear, request clarification.
4. **Request changes when needed.** It's better to ask for improvements than approve something you don't understand.

### If You Can't Understand the PR

**The PR is not complete.** Don't approve it.

Instead:
- Request changes explaining what's unclear
- Ask the author to improve the description
- If needed, schedule a conversation—but require the PR to be updated afterward

---

## PR Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Author    │────▶│   Review    │────▶│   Approved  │────▶│    Merge    │
│  Opens PR   │     │  Requested  │◀─┐  │             │     │  to main    │
└─────────────┘     └──────┬──────┘  │  └─────────────┘     └─────────────┘
                           │         │
                           ▼         │
                    ┌─────────────┐  │
                    │  Changes    │  │
                    │  Requested  │  │
                    └──────┬──────┘  │
                           │         │
                           ▼         │
                    ┌─────────────┐  │
                    │   Author    │──┘
                    │   Updates   │
                    └─────────────┘
```

### What Blocks a Merge

- Incomplete PR description
- Missing testing steps
- Failing tests or CI checks
- Unresolved review comments
- Reviewer unable to understand the change
