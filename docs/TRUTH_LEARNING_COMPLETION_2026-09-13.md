# Truth & Reconciliation coordinated completion — September 13, 2026

Based on current remote main `9aa4c4e696929bacce9cb774b9f4d8b159067d42`. Existing classroom work, opening windows and GitHub Pages addresses are preserved. This is a bounded addition, not a whole-site readiness certification.

## Changes

- Teacher Hub: existing Truth & Reconciliation calendar inquiry now opens a prepared 40-minute, eight-stop source sequence in teacher and student/projector routes. Includes a short quotation from Phyllis Webstad, a short NCTR quotation and historical explanation, Katzie's living place names, a worked source-care card, practice and understanding check. Teacher guidance is omitted in student mode. Optional fictional listening practice remains separate and explicitly fictional.
- Equity Hub: adult response guide in the Truth, place & responsibility lesson overview. Distinguishes sincere questions, mistakes, interpretation, misinformation and patterns of denial or distortion without labelling a child from one question. Includes a response script, source selection, false-balance guidance, pause/support steps and NCTR attribution. It is hub-authored guidance, not an endorsed Nation/NCTR protocol.
- Student & Family: dedicated learning page, linked from Students, Families and Learning, with optional family prompts, the selected sources and source-care task. No personal disclosure or uploaded work requested.
- Matching source/date data is in `content/truth-learning-2026.json` in all three repositories. Teacher Hub is canonical; from sibling checkouts run `node scripts/sync-truth-learning.mjs --check` (or omit --check to sync the data). Preserve separate commits in each repository.
- Learning September 14–24; school display September 29; national observance September 30; proposed class responsibility follow-up October 8. Corrected a public-window class follow-up previously placed on the September 30 school closure.

## Source and content review

Original pages checked September 13, 2026: Orange Shirt Society's Phyllis Webstad page; NCTR Residential School History, ReconciliACTION Plans and Stephanie Scott's September 29, 2023 truth-telling statement; Katzie homepage, Who We Are and language page; Semiahmoo homepage; Kwantlen Strong; official BC Social Studies 6 curriculum.

Quotations are short and kept distinct from classroom-authored summaries. Source publication dates are not invented. NCTR's explanation is correctly identified as a historical synthesis, not an original school record. Phyllis's account is not generalized to every Survivor. Katzie speaks for Katzie; living Nations, rights and continuity remain explicit. Full source pages need an adult preview beyond the selected passages. No graphic source browsing, denial-claim catalogue, trauma simulation or demand for Indigenous students to explain their community.

Kwantlen's homepage is under construction; the public Kwantlen Strong page is available and replaces the classroom link to the homepage. Do not assume a homepage search snippet describes the current page.

## Verification before publication

This repository: `npm test` passed (15 tests), including TypeScript/build and published-artifact checks. All three source/date copies match. Teacher Hub's existing rendered-route regression now uses the actual new source component and checks that answer guidance is absent from student mode. Whitespace checks passed.

Local browser preview was unavailable: Vite failed with a network-interface enumeration error, and the browser could not open the local static preview. The public GitHub Pages site was accessible in the supported browser; post-deployment interaction review is recorded in the HQ completion record. No classroom-use trial or full printable-pack re-review is claimed; existing PDF packs are unchanged.

Git publication must be fast-forward from the inspected baseline, without force. For a normal git push, local and remote commit SHA and source tree should be identical; verify after pushing. Deployment status must match that exact commit, not merely an earlier successful run.
