# Student and Learning refresh · November 13, 2026

The November 12 visual preview was restored and published on November 13. Family Hub commit `66d67d2` and Teacher Hub commit `eec5f28` both passed their GitHub Pages deployments. The Teacher publication also preserves the separately completed fractions update.

## Changes
- A warm, visual Student launchpad separates continuing assigned work, sharing thinking and optional exploration.
- A Learning map connects reading, mathematical models and a broader two-country inquiry. All ten subjects remain available.
- Current routines, school dates and longer reference resources are expandable rather than competing with the first action.
- Internal jump links use the site's route-aware anchor format. The reading link opens English Language Arts directly.
- Current public source copy preserves Friday's Health/SpacesEDU priorities, removes expired assembly/device notes and no longer calls November 12 swimming upcoming.
- November's public month overview includes government, migration, resources, cooperation and rights. National Child Day remains a connection, not a deadline.
- The no-routine-homework policy, optional choices, private sharing boundaries and Fieldnotes save warning remain.

## Verification
- Family Hub release: complete npm test passed, including build, artifact validation and 51 tests. The follow-up navigation fix adds four behavioural regression tests.
- Teacher Hub: complete npm test passed after rebasing the fractions update, including public-window consistency, typecheck, 326 tests, build and emitted-artifact validation.
- Generated public manifests match byte for byte across repositories.
- Main resource links returned HTTP 200. Query-driven routes also inspected against router/subject sources.
- New tests cover current student copy, anchor routing, all ten subjects, unique labelled destinations, asset existence, responsive/focus/print rules and historical lessons.
- Preview HTML contains the real current components and CSS, embedded hero images, working disclosure panels, jump links and large-text buttons. Its other navigation opens existing live resources.
- Live Student and Learning pages were checked in a desktop browser at 1212 CSS pixels. Images loaded, headings and links were visible, and the standard and large-text layouts had no horizontal overflow. Keyboard activation, section focus, expandable panels and Back navigation were exercised.
- An additional repeated-activation check found that a section link stopped jumping after its hash was already current. The follow-up fix restores both keyboard focus and scrolling for repeated section or page navigation, without intercepting modifier clicks, downloads, external links or new tabs.
- All ten reviewed source text/background colour pairs exceed the 4.5:1 AA normal-text contrast threshold. This is a source-colour check, not a full computed-style accessibility audit.
- Actual phone/narrow-viewport and print-output appearance remain unverified. The available browser does not expose viewport or print-emulation controls; no mobile or print pass is claimed.

## Live pages
- https://dlwyatt-eng.github.io/learn/#/students
- https://dlwyatt-eng.github.io/learn/#/learning

Future updates must still preserve current remote work, use the canonical Teacher Hub source for public classroom copy, run the relevant quality gates and verify deployed changes. Do not treat planned learning as completed work or add new assignments or policies through a visual refresh.
