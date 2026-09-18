# Classroom OS public hub rules

## Keep Learn Hub aligned with published teaching

After a major day-plan change, schedule change, or addition that families/students need, update the public summary and confirmed school dates in teacher-hub/content/current-learning-window-v2.json. Distinguish planned activities from confirmed classroom experience. Run teacher-hub npm run sync:public-window and copy the resulting public/generated/public-window-v2.json to learn/app/generated/public-window-v2.json. Update relevant public resource links when new materials should be discoverable. Review both renderers, run appropriate checks, commit and publish both without overwriting newer work. Minor code/layout changes do not require a family announcement.

Teacher Hub is canonical. Preserve earlier day plans and git history. Never copy teacher fields, private notes, student names/work, or licensed uploads into Learn. Device-local calendar/day-plan edits are not automatically available remotely. Keep unknown dates approximate. Do not infer that planned lessons happened, that SpacesEDU setup is complete, or that forms were distributed. Do not send parent email as part of synchronization. An hourly ChatGPT task checks published changes and quietly skips when there is nothing meaningful to sync.
