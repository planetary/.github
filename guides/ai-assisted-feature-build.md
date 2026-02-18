# Workflow: AI-Assisted Feature Build

From ticket to PR — building a new feature with AI assistance, step by step.

**Mental models applied:** [The 70/30 Split](../standards/ai-assisted-development.md#the-7030-split), [Small Bites](../standards/ai-assisted-development.md#small-bites), [Context Is the Product](../standards/ai-assisted-development.md#context-is-the-product)

---

## The Workflow

### Step 1: Read and Understand the Ticket (You, Not the AI)

Read the ticket thoroughly. Understand:

- What the feature does from the user's perspective
- What the acceptance criteria are
- What designs or specs exist (Figma, wireframes, written spec)
- What existing code this will touch or extend

**Do not paste the ticket into an AI tool and say "build this."** That's a 30/70 split — you've abdicated direction and handed the AI the wheel.

### Step 2: Plan the Architecture (You, With AI as a Sounding Board)

Before any code is written, decide:

- Where does this feature live in the codebase?
- What existing patterns should it follow?
- What are the moving parts? (API route, component, state, CMS schema, etc.)
- What order should things be built?

You can use the AI as a sounding board here:

```
"I need to add a location search feature to the DTF site.
The site uses Next.js App Router with Sanity CMS. Existing search
patterns are in src/components/Search/. The locations are stored
in Sanity as 'location' documents.

I'm thinking: Sanity GROQ query → API route → React component
with autocomplete. Does that order make sense, or would you
approach it differently?"
```

The AI might suggest something useful. But you make the architectural decision.

### Step 3: Break It Into Commits

Plan your commits before writing code. Each commit should be one small, reviewable unit:

```
1. Add GROQ query and API route for location search
2. Add LocationSearch component with autocomplete UI
3. Wire LocationSearch into the header
4. Add loading and error states
5. Add tests
```

Each step is a "small bite." Each gets its own prompt-review-commit cycle.

### Step 4: Build Each Piece (One at a Time)

For each planned commit:

**Prompt with specifics:**

```
"Create the API route at src/app/api/locations/search/route.ts.
It should accept a 'q' query parameter and search Sanity location
documents by name using the existing Sanity client at src/lib/sanity.ts.
Return the results as JSON with {id, name, address, slug} fields.
Follow the pattern in src/app/api/menu/route.ts."
```

**Review the output:**
- Does it use the existing Sanity client, or did it create a new one?
- Does the GROQ query look right?
- Does the response shape match what you specified?
- Did it add anything you didn't ask for?

**Verify it works:**
```bash
npm run build
# Test the route manually: curl localhost:3000/api/locations/search?q=test
```

**Commit:**
```bash
git add src/app/api/locations/search/route.ts
git commit -m "feat(DTF-123): add API route for location search"
```

Then move to the next piece.

### Step 5: Integrate and Test

Once all pieces are committed individually:

```bash
# Full build
npm run build

# Run the test suite
npm test

# Manual testing: go through the acceptance criteria from the ticket
```

### Step 6: Open the PR

Write the PR description yourself. The AI can draft it, but you must edit it to accurately represent what was built and why. Use the [Planetary PR template](../.github/PULL_REQUEST_TEMPLATE.md).

---

## Example: What This Looks Like End-to-End

**Ticket:** DTF-123 — Add location search with autocomplete to the header

**Commits:**
```
feat(DTF-123): add GROQ query for location search
feat(DTF-123): add /api/locations/search route
feat(DTF-123): add LocationSearch autocomplete component
feat(DTF-123): integrate LocationSearch into SiteHeader
feat(DTF-123): add keyboard navigation to LocationSearch
test(DTF-123): add tests for location search API route
```

**Each commit:** prompted individually, reviewed, build-validated, committed.

**Total time:** comparable to building it manually, but with cleaner commit history and consistent patterns.

---

## Common Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| "Build the whole feature" as a single prompt | Break into planned commits first, prompt one at a time |
| Accepting AI's architectural decisions without questioning | You decide architecture; AI implements your decisions |
| Skipping the build check between commits | One broken commit compounds into many broken commits |
| Letting the AI write the PR description without editing | The developer authors the PR — AI drafts are a starting point only |
| Adding tests last and discovering the code doesn't work | Verify each step works before moving to the next |
