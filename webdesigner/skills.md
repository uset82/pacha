# Agent Skills

WebDesigner skills are stage contracts, not vendor-specific prompt bundles. Each skill must declare its inputs, outputs, preconditions, postconditions, and emitted artifact types.

## Source of Truth
- Skill metadata lives in `.antigravity/runtime/skill-contracts.json`.
- Shared interfaces live in `.antigravity/runtime/INTERFACES.md`.
- Machine-readable schemas live in `.antigravity/runtime/schemas/`.

## V1 Skills

### `framework-selector`
- **Stage**: `plan`
- **Role**: Produces a layered `StackSelection` for the curated v1 stack matrix
- **Inputs**: `TaskIntent`
- **Outputs**: `StackSelection`
- **Artifacts**: `stack-selection`, `decision-log`

### `stitch-design`
- **Stage**: `design`
- **Role**: Invokes the default `DesignProvider` and produces a portable design artifact set
- **Inputs**: `TaskIntent`, `StackSelection`, optional prior `DESIGN.md`
- **Outputs**: design bundle
- **Artifacts**: `design-brief`, `design-tokens`, `component-inventory`, optional `mood-board`, optional `content-plan`, optional `motion-plan`, optional `stitch-html`, optional `stitch-image`

### `project-scaffolder`
- **Stage**: `build`
- **Role**: Creates the generated workspace for a selected stack
- **Inputs**: `StackSelection`, existing `ArtifactManifest`
- **Outputs**: scaffolded workspace path and command log
- **Artifacts**: `workspace-layout`, `scaffold-log`

### `code-generator`
- **Stage**: `build`
- **Role**: Turns approved design artifacts into idiomatic code inside the generated workspace
- **Inputs**: design artifacts, `StackSelection`, workspace path
- **Outputs**: implemented files and implementation summary
- **Artifacts**: `implementation-log`, `file-map`, optional `ui-verification-log`

### `security-audit`
- **Stage**: `security`
- **Role**: Builds a threat model, validates findings, and records patch proposals for the generated workspace
- **Inputs**: `StackSelection`, existing `ArtifactManifest`, workspace path
- **Outputs**: validated security findings and remediation proposals
- **Artifacts**: `security-threat-model`, `validated-finding`, `security-patch`

### `deploy-advisor`
- **Stage**: `deploy`
- **Role**: Maps the chosen stack to a supported deployment target and emits deployment config
- **Inputs**: `StackSelection`, workspace path
- **Outputs**: deploy config and release notes
- **Artifacts**: `deploy-config`, `deploy-instructions`

## Global Optional Skills

### `frontend-skill`
- **Stages**: `design`, `build`, `review`
- **Role**: Adds art-direction, hierarchy, motion, and restraint rules for visually led frontend work
- **Inputs**: task brief, design artifacts, optional visual references or existing images
- **Outputs**: stronger visual thesis, content plan, interaction thesis, and section-level quality checks
- **Notes**: This skill complements `stitch-design` and `code-generator`; it does not replace WebDesigner's artifact and handoff contracts.

Official Stitch-oriented or OpenAI-oriented skills can be attached when they fit the active workflow, but they do not replace WebDesigner's stage contracts, routing policy, or artifact manifest.
