# School dates and ongoing family updates — 2026-09-18

Teacher-confirmed school dates are canonical in `teacher-hub/content/current-learning-window-v2.json` under `schoolEvents`. The public projection includes only those class-wide event fields. Teacher Hub Monthly Calendar shows exact dates alongside saved local entries, without making published dates removable as local entries. Approximate food-drive timing stays a month note.

Learn Home and Families show the same upcoming school events. Past exact events disappear after their date, while the approximate October item remains through October. Open House is confirmed October 1, 5:30–6:30 pm. Earlier first-week summary, device form, planner $6 reminder and pending SpacesEDU status remain.

An enabled hourly ChatGPT task, “Keep Learn Hub current”, checks the two GitHub repositories for meaningful published changes. It synchronizes the safe projection and family-facing resource additions after review and checks. It must preserve future/planned versus completed distinctions, privacy, source history and concurrent changes. It does not email parents. Local browser edits cannot be seen until exported/shared/published. This is an hourly condition check, not instant two-way sync.

Current source version: `2026-family-school-dates-2026-09-18`.
Prior synced remote releases: teacher-hub `a8fd18b398a04242b14ed2a07ff432a3deb21da7`, learn `b5d1c04153d1ee1de3de3d67b5b5133833c7727a`.
The release commit messages record the matching tested local commit; tree equality is checked before each remote ref update.

Validation: public manifest equality/checksum, TypeScript/build gates, Learn rendered checks for dates/times, expiry and approximate date preservation. Live release verification is reported separately.
