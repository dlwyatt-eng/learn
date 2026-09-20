# Belonging and community integration

## Existing work reused

Inspected Teacher Hub Games & Activities, community-practice.json, Monday's archived plan and teaching reference, Discovery/Opening Rotations references, responsibilities, PHE season planning, Truth and Reconciliation sequence, and the rights-strand release record. Read the supplied AI Ecosystem Source Pack: the core learning works without devices, AI or a portfolio upload. The supplied roster is not needed and no student information is published.

Inspected Equity Hub Belonging is built, Barrier Detectives, Rights in Our Room, the student-action workspace and the existing rights strand. Extracted the actual Belonging Action Studio and Access Makeover Lab B&W PDFs. Their full-page studios, class commitments and Ways-to-Join menu remain canonical; no replacement packs were created.

## Monday

The existing 8:50–9:20 block now opens six projector cards: brief restorative acknowledgement (3), invitation versus participation (4), Person → Barrier → Redesign model (5), broader barriers (5), partner redesign (8), commitment and exit (5). The apology is visible initially; examples can be shown or hidden. All essential directions, prompts and examples are available in projector mode. Teacher preparation and notes remain hidden there.

The 2:00 activity/care block checks the commitments. All other blocks and every bell time are preserved; a programmatic comparison checked this. The earlier Monday revision remains in git history and the dated plan remains in the archive. No scheduled PE heading was added. No specific child is the reason given for inclusion.

## Later sequence

1. Who gets to belong? Monday, 30 minutes.
2. How do we treat one another? Existing Five Agreements and infographic, separate 60-minute route.
3. What happens when our needs collide? Existing NVC with added noticing-versus-judging and two-needs/replay cards, separate 60-minute route.
4. Does fair mean the same? Ten-minute scenario comparison plus the existing 40–50 minute Barrier Detectives Access Makeover.
5. What can we do when systems exclude people? Rights in Our Room, student action/Leadership & Spirit Club and later Racism, Human Rights & Freedom of Expression. Existing legal material was not rewritten or independently revalidated in this pass.

The sequence links these to games, PHE, group work, buddy activities, captains, field trips, restorative repair, Social Studies and Truth and Reconciliation. Indigenous learning retains its own historical context and authentic sources.

## Print and routes

New public/printables/belonging-barrier-redesign.pdf: page 1 routine mini-poster; pages 2–3 six fictional barrier cards; page 4 four equality/equity/accessibility comparisons for later; page 5 class commitment chart. Select pages rather than making a class set by default. Existing Equity page 3 is an alternative chart; do not require both. Generator: scripts/build-belonging-pack.py; canonical scenario source: content/belonging-sequence.json.

Teacher routes: ?view=Games+%26+Activities&deck=belonging and &deck=belonging-sequence, with &mode=student for projector; existing agreements/nvc routes; Monday Day Plans/Morning Screen; Responsibilities; PHE season panel. Equity now resolves actual lesson IDs at #lesson/<id> and #action, and links the sequence from relevant lesson previews, printables and action. Learn's home/family summary and resource links are projected from the Teacher manifest; no private notes or new homework assignment were copied.

## Verification before publication

Teacher: all 185 existing tests passed, typecheck passed, production build and artifact gate passed after shortening duplicated day-plan notes to retain the initial download budget. Learn: 23 of 24 tests passed initially; the single failure was an exact wording assertion, repaired by retaining “Truth and Reconciliation booklets”; all four family-welcome checks then passed. Final Learn build passed. Equity: build and all 27 tests passed. Public manifests are byte-identical. SSR checks rendered all three community decks and the sequence without teacher notes; the Monday comparison verified all bell times and untouched blocks. All five PDF pages were rendered and visually inspected; embedded fonts repaired spacing, and the longest scenario was shortened to preserve clear separation.

The supported cloud browser could not access the local preview (ERR_BLOCKED_BY_CLIENT). Existing live projector navigation was inspected; post-publication browser checks are reported separately. No physical printing, actual classroom projection or student-comprehension testing is claimed.

## Next coordinated update

After Monday, record actual timing, unfinished work, the two commitments and whether changes helped, without private student details. Place the separate Agreements/NVC lessons after specialist and support times are confirmed. Check the next activity's actual surface, equipment, communication and participant preferences before using it. Confirm buddy timing with the colleague. Keep the existing Truth and Reconciliation booklet/source preparation task. There is no need to add more near-duplicate belonging resources.
