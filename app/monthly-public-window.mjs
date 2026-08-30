const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SCHOOL_MONTH_ENDS = {
  "2026-10": "2026-10-31",
  "2026-11": "2026-11-30",
  "2026-12": "2026-12-18",
  "2027-01": "2027-01-29",
  "2027-02": "2027-02-26",
  "2027-03": "2027-03-31",
  "2027-04": "2027-04-30",
  "2027-05": "2027-05-31",
  "2027-06": "2027-06-24",
};

/**
 * Builds a concise Student/Family month view from the exported whole-year plan.
 * It is a projection of the same curriculum record, not a second curriculum.
 */
export function monthlyPublicWindowForDate(yearMonths, template, dateKey) {
  const [year, monthNumber] = dateKey.split("-").map(Number);
  const monthName = MONTH_NAMES[monthNumber - 1];
  const schoolMonthKey = `${String(year).padStart(4, "0")}-${String(monthNumber).padStart(2, "0")}`;
  const effectiveTo = SCHOOL_MONTH_ENDS[schoolMonthKey];
  const month = yearMonths.find(item => item.month === monthName);
  if (!month || !effectiveTo) return null;

  const highlights = month.highlights.map((highlight, index) => {
    const [timing, ...rest] = highlight.split(" · ");
    return {
      timing: rest.length ? timing : `Move ${index + 1}`,
      detail: rest.length ? rest.join(" · ") : highlight,
    };
  });
  const effectiveFrom = `${schoolMonthKey}-01`;

  return {
    ...template,
    id: `monthly-learning-${schoolMonthKey}`,
    effectiveFrom,
    effectiveTo,
    state: "published",
    shared: {
      ...template.shared,
      eyebrow: `${month.month.toUpperCase()} · CURRENT MONTH`,
      title: month.focus,
      bigQuestion: `How will this month's questions change what we notice, explain, make, or decide?`,
      summary: month.learning,
      learningArc: highlights.map(item => ({
        timing: item.timing,
        label: "Investigate",
        studentAction: item.detail,
        outcome: "The exact classroom task appears on the teacher-controlled daily screen.",
      })),
      visual: {
        src: "/images/public-student-learning-mosaic-v1.webp",
        alt: "Grade 6 students reading, discussing, studying maps and data, making, moving, and learning from one shared classroom screen.",
        caption: `${month.month}: ${month.subjects.join(" · ")}`,
      },
      primaryResource: null,
      subjectSnapshot: month.subjects.map(subject => ({ subject, now: month.focus, why: month.learning })),
    },
    student: {
      ...template.student,
      label: "STUDENT MONTH",
      title: month.focus,
      why: month.learning,
      summary: `This month connects ${month.subjects.join(", ")}. The classroom screen gives the exact task for each day.`,
      duration: month.timing,
      grouping: "Whole class, partners, teams, and individual reflection",
      routeTitle: `${month.month} learning route`,
      bring: ["Your current class materials", "A question or connection", "Check the classroom screen for today's exact task"],
      firstMove: "Read the current focus. Name one word, issue, or idea you want explained in class.",
      quickReference: {
        firstMove: "Check the classroom screen, then name one thing you already know and one question.",
        handIn: "Finish or save only the task your teacher identifies today.",
        missed: "Ask for the source, question, and one essential next step—not every missed minute.",
      },
      firstMoveNote: "The monthly view shows the direction; the classroom screen names today's source, materials, grouping, and finish point.",
      steps: highlights.map(item => `${item.timing}: ${item.detail}`),
      choices: ["Talk, read, listen, sketch, make, move, or write when that route fits the learning.", "Work with others when comparison strengthens thinking; use individual work when your own evidence matters."],
      product: month.anticipatedShare,
      finish: "Explain what you learned, what evidence mattered, and what question remains.",
      handInOrSave: "Use SpacesEDU only when your teacher identifies a selected piece of evidence or reflection.",
      ifAbsentOrStuck: "Check this month view and SpacesEDU, then ask your teacher for the essential source, question, and next step.",
      spacesNote: "SpacesEDU holds selected evidence, feedback, and reflection; most daily practice stays in class.",
    },
    family: {
      ...template.family,
      label: "FAMILY MONTH",
      title: `${month.month} in Grade 6`,
      summary: month.learning,
      whyThisMatters: month.focus,
      whatStudentsDo: highlights.map(item => item.detail).join(" "),
      quickReference: {
        atSchool: month.learning,
        home: "No standing homework or special supplies. Check SpacesEDU only for work the teacher has identified.",
        assessment: "The teacher gathers evidence through discussion, class work, projects, and selected reflection.",
        spaces: "SpacesEDU remains the secure home for selected evidence, feedback, and reflection.",
      },
      product: month.anticipatedShare,
      assessment: "Students receive time to investigate, make, discuss, revise, and complete worthwhile work before selected evidence is shared.",
      agreementNote: "The daily classroom screen—not the public site—carries changing class instructions and private operational details.",
      groupAndIndividualEvidence: "Collaborative work shows listening and revision; individual evidence is used when each student's understanding matters.",
      milestones: highlights.map(item => ({ date: item.timing, label: item.detail, shortLabel: item.detail })),
      homework: "No standing homework or special supplies are expected.",
      supportAtHome: ["Ask what source, image, text, data, or experience started the learning.", "Ask what changed or complicated your child's first idea.", "Use SpacesEDU to review selected evidence when the teacher posts it."],
      conversationPrompts: ["What question is the class following this month?", "Which source or experience changed your thinking most?"],
      spacesNote: "SpacesEDU is the secure portfolio; this public month view contains no student work, names, grades, or private classroom information.",
    },
  };
}
