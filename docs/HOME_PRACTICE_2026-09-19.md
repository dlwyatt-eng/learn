# Home practice release — September 19, 2026

Adds a student-and-family Homework & Extra Practice route with ten short optional activities, screen-free alternatives, printable practice and family checking guidance. Separate daily homework is not routinely assigned; the menu has no hand-in deadline and does not require completing every subject.

Teacher Hub `content/home-practice.json` is canonical. The public projection is copied to Learn, where `#/homework` renders the student-and-family route. The menu distinguishes unfinished work specifically identified by the teacher from optional practice, and labels the dated opening-week menu as reusable rather than a new assignment after September 20.

## Synchronized source versions

Home-practice source release: Teacher Hub `b3da8ca6c3939249681b601145c17fb55160faf6`; Learn `af996d86a2d049e0c2be27dfeff1d4107ac9a17f`. The byte-identical public manifests use content version `2026-09-19-home-practice`, blob `07746baac355a73469cf323c0a1ef476add8deea`, and checksum `sha256:fd1a3176fbab27559e42d487e7404e16e1159133be36328cb7a80dbe2bad2081`.

## Safety and expectations

Prodigy and NoRedInk are offered only when school-provided access and teacher instructions are available. Every activity has an account-free route. No purchase, AI tool, routine SpacesEDU upload, new due date or family submission is required. The menu does not publish individual adaptations, student work, scores or private notes.

## Verification

Teacher Hub and Learn public manifests were byte-compared. Repository rendering checks cover date rollover, optional-language boundaries, actual activities, checking guidance, offline routes and the absence of a SpacesEDU upload expectation. Both GitHub Pages deployment workflows completed successfully.
