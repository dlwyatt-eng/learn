# Student and Learning refresh · November 13, 2026

This review restores the November 12 visual preview on top of published Family Hub commit d3e5c69 and Teacher Hub commit b5ae2eb. It does not replace either live site yet.

## Changes
- A warm, visual Student launchpad separates continuing assigned work, sharing thinking and optional exploration.
- A Learning map connects reading, mathematical models and a broader two-country inquiry. All ten subjects remain available.
- Current routines, school dates and longer reference resources are expandable rather than competing with the first action.
- Internal jump links use the site's route-aware anchor format. The reading link opens English Language Arts directly.
- Current public source copy preserves Friday's Health/SpacesEDU priorities, removes expired assembly/device notes and no longer calls November 12 swimming upcoming.
- November's public month overview includes government, migration, resources, cooperation and rights. National Child Day remains a connection, not a deadline.
- The no-routine-homework policy, optional choices, private sharing boundaries and Fieldnotes save warning remain.

## Verification
- Family Hub: complete npm test passed, including build, artifact validation and 51 tests.
- Teacher Hub: complete npm test passed, including public-window consistency, typecheck, 320 tests, build and emitted-artifact validation.
- Generated public manifests match byte for byte across repositories.
- Main resource links returned HTTP 200. Query-driven routes also inspected against router/subject sources.
- New tests cover current student copy, anchor routing, all ten subjects, unique labelled destinations, asset existence, responsive/focus/print rules and historical lessons.
- Preview HTML contains the real current components and CSS, embedded hero images, working disclosure panels, jump links and large-text buttons. Its other navigation opens existing live resources.
- Browser visual, keyboard interaction and print-output QA remain unverified: local Chromium cannot create its required socket in this executor, including through the approved escalation path. No browser screenshots or claim of live deployment is made.

## Release boundary
Keep this as a review. Obtain approval of the updated preview before merging or deploying the major redesign. After approval, recheck both remote main branches, preserve newer changes, rerun both quality gates, publish matching canonical/source and renderer changes, and verify the exact deployed commits.
