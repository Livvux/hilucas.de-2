---
name: commit
description: Selectively commit changes from the current conversation
argument-hint: "[all] [push]"
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git add:*), Bash(git diff:*), Bash(git commit:*), Bash(git log:*), Bash(git check-ignore:*), Bash(git push:*)
---

Commit changes based on the argument provided: $ARGUMENTS

## Options

Arguments can be combined in any order:

- **Default (no argument)**: Commit only files related to the current conversation's work
- **`all`**: Commit all pending changes in the working directory
- **`push`**: Push to remote after committing

## Instructions

1. Run `git status` to see all modified and untracked files
2. Run `git diff --stat` to see a summary of changes
3. Run `git log -3 --oneline` to see recent commit style
4. Determine which files to stage:
   - If argument includes `all`: commit all pending changes, but group them into logical commits
   - Otherwise: identify only files related to the current conversation's work
5. Group related changes and create separate commits for each logical unit
6. For each commit: stage the files with `git add`, then commit with a descriptive message
7. If argument includes `push`: run `git push` after all commits are complete

## Commit message format

Use a HEREDOC for proper formatting:

```bash
git commit -m "$(cat <<'EOF'
Short summary of changes (imperative mood)

Optional body explaining the "why" if needed.

EOF
)"
```

## Guidelines

- Use present tense: "Add feature" not "Added feature"
- Keep summary under 50 characters
- One logical change per commit — never lump unrelated changes together
- With `all`: always break changes into separate logical commits (e.g., separate commits for a component fix vs. README updates)
