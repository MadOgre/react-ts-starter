# Issue tracker: Local Markdown in `docs/planning/`

Issues and specs for this repo live as markdown files in `docs/planning/`. That folder is committed with the repo; it is the project's planning record, not scratch space.

Some skills name `.scratch/<feature-slug>/` as the home of local issue files. In this repo that path is always `docs/planning/<feature-slug>/`.

## Conventions

- One feature per directory: `docs/planning/<feature-slug>/`
- Every feature folder holds an `INTENT.md`: see [The intent document](#the-intent-document)
- Grilling rounds are `docs/planning/<feature-slug>/round_<N>_questions.md`, numbered from `1`
- The spec is `docs/planning/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `docs/planning/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## The intent document

`INTENT.md` is the developer's own statement of what the feature is for, in their words. Everything else in the folder (grilling rounds, spec, tickets) is derived from it.

- **Read it first** whenever you work on a feature, before its other planning files.
- **When it's missing,** create it with the template below, ask the developer to fill it in, and stop. Continue the feature's work only once they have.
- The developer owns its wording. Record later decisions in the rounds, the spec or ticket comments, and leave `INTENT.md` as written.

Template:

```markdown
## Goal
-

## Definition Of Done
-

## Constraints
-

## Acceptance Criteria
[ ]

## Thoughts
```

## When a skill says "publish to the issue tracker"

Create a new file under `docs/planning/<feature-slug>/`. If the folder is new, the intent document comes first.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path, and the feature's `INTENT.md`. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `docs/planning/<effort>/map.md` (the Notes / Decisions-so-far / Fog body), next to the effort's `INTENT.md`.
- **Child ticket**: `docs/planning/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `docs/planning/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
