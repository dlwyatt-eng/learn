# Family Hub maintenance — October 8, 2026

Source bases: Learn b2cc4c6226a81d9ba76123084a59b4e5fee41998; Teacher Hub 2062a47e049ed0a2d938feed032cb710f0427a10. Isolated worktrees preserve newer work. Release commits are pushed directly without rewriting history; local and GitHub commit trees are identical.

Canonical updates: Teacher Hub content/current-learning-window-v2.json and content/home-practice.json. Archived the outgoing September 28 practice menu. Ran sync:public-window and copied the generated manifest unchanged into Learn. Retained recurring routines and unrelated lesson content.

Daryl confirmed volunteers 12:35 pm and student staggered start 1:00 pm; run ends 2:00 pm. Added rain-or-shine preparation, goal reached, and retained donation URL. Removed expired prominent reminders and daily timetable; preserved recurring PE/library/French responsibilities. Practice covers rounding, comparing whole numbers/decimals, explaining, offline options and no required uploads. No factors assignment.

School fees page checked October 8: https://www.surreyschools.ca/walnutroad/school-fees-supplies lists optional $5 planner for 2026–27. Replaced stale $6/September 18 wording; account discrepancies go to the office. Public calendar/search did not confirm retakes; date now unconfirmed, not October 21. No private student records accessed.

Validation: Learn 27 tests and production build/artifact check passed; Teacher Hub 237 tests, typecheck, sync checksum, build and artifact check passed. Updated stale assertions to the current menu/reminders. Reviewed mathematical examples and both home-practice renderers in source. Chromium browser checks at 1440 and 390 px, standard and large text: direct entry, family/homework navigation, anchors, direct anchor links, back/forward, keyboard skip link, student launch visibility, no horizontal overflow and no page exceptions. Screenshots reviewed for desktop/mobile practice, family reminder and student launch layouts. Header offset measures actual rendered header height with ResizeObserver; no fixed-height assumption.

Important live links returned HTTP 200: Terry Fox donation, original permission PDF, Teacher Hub, school fee page, volunteer page and School Cash Online. No family email sent. Classroom use not assessed by this release.
