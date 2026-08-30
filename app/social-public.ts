export type PublicSocialResource = { label: string; source: string; url: string; gradeFit: string; purpose: string };
export type PublicSocialScene = { label: string; title: string; prompt: string; time: string; learningMode: string; studentTask: string };
export type PublicSocialLesson = {
  id: string;
  title: string;
  question: string;
  duration: string;
  kind: string;
  learning: string;
  success: string[];
  vocabulary: string[];
  evidenceLevel: "Practice" | "Checkpoint" | "Portfolio Highlight";
  evidenceSubjects: string[];
  spacesPrompt: string;
  scenes: PublicSocialScene[];
  resources: PublicSocialResource[];
};

export const socialUnits = [
  ["01", "Place, Evidence & Perspective", "How sources shape what becomes visible", "4–5 weeks", "READY NOW"],
  ["02", "Power, Rights & Government", "Who decides—and whose rights are protected?", "4–5 weeks", "COMING NEXT"],
  ["03", "Global Systems & Inequality", "Connections, consequences, and cooperation", "4–5 weeks", "PLANNED"],
  ["04", "Solutionary Inquiry", "Understand systems before proposing change", "5–6 weeks", "PLANNED"],
] as const;

export const socialLessons: PublicSocialLesson[] = [
  {
    id: "maps-make-arguments", title: "Maps make arguments", question: "Can a map be accurate and still leave out something important?", duration: "2 × 55–65 min", kind: "Map inquiry",
    learning: "We are learning to treat maps as sources created for a purpose—not as neutral pictures of reality.",
    success: ["I can separate what a map shows from what I infer.", "I can identify an audience, purpose, and important omission.", "I can compare maps before drawing a conclusion about place."],
    vocabulary: ["source", "evidence", "inference", "perspective", "territory", "unceded"], evidenceLevel: "Practice", evidenceSubjects: ["Social Studies", "ELA", "Arts"], spacesPrompt: "No post required. Save the purposeful map only if your teacher selects it later.",
    scenes: [
      { label: "Notice", title: "Three maps. Three different stories.", prompt: "Study a street map, the First Peoples’ Map of B.C., and the Fleetwood planning map. Record only what is visibly present before interpreting.", time: "20–25 min", learningMode: "Silent gallery walk · notice/inference sort", studentTask: "Nine observations and three questions" },
      { label: "Interrogate", title: "What was this map made to help someone do?", prompt: "Use title, legend, labels, boundaries, scale, and source information to infer audience and purpose. Mark what each map makes easy—and difficult—to see.", time: "30–35 min", learningMode: "Source stations · annotation · partner reasoning", studentTask: "A source anatomy sheet for three maps" },
      { label: "Compare", title: "What changes when the map changes?", prompt: "Layer evidence from all three maps. Build one conclusion that no single map could support alone, then name a limitation.", time: "35–40 min", learningMode: "Physical overlay or table · evidence conference", studentTask: "A corroborated conclusion and stated limit" },
      { label: "Create", title: "Design a map for a real audience", prompt: "Choose a school-community question. Decide what to include, exclude, emphasize, and cite so the map serves its audience without pretending to show everything.", time: "35–45 min", learningMode: "Map design · peer audit · revision", studentTask: "A purposeful map with legend, source note, and omission statement" },
    ],
    resources: [
      { label: "First Peoples’ Map of B.C.", source: "First Peoples’ Cultural Council", url: "https://maps.fpcc.ca/", gradeFit: "Core Grade 6", purpose: "Explore language regions, communities, place names, and the source information provided by the map." },
      { label: "Fleetwood Plan", source: "City of Surrey", url: "https://fleetwoodplan.surrey.ca/", gradeFit: "Core Grade 6", purpose: "Identify what the planning map emphasizes as Fleetwood prepares for growth and rapid transit." },
    ],
  },
  {
    id: "trace-the-claim", title: "Trace the claim", question: "What should we do before we believe, share, or act on an online claim?", duration: "2 × 55–65 min", kind: "Media evidence lab",
    learning: "We are learning to leave a post, locate the original source, verify the source, and compare independent coverage.",
    success: ["I can trace a claim toward its original source.", "I can verify who is behind a source and what evidence it provides.", "I can label a conclusion supported, contradicted, or still uncertain."],
    vocabulary: ["claim", "original source", "corroborate", "context", "reliable", "uncertain"], evidenceLevel: "Checkpoint", evidenceSubjects: ["Social Studies", "ELA", "ADST"], spacesPrompt: "Post the source trail only if your teacher selects it. Explain which verification move changed or complicated your judgment.",
    scenes: [
      { label: "Diagnose", title: "Why is this post convincing?", prompt: "Examine a fictional viral post. Identify emotional language, missing source information, cropped context, numbers without explanation, and social proof before deciding whether the claim is true.", time: "20–25 min", learningMode: "Visual diagnosis · silent commitment · discussion", studentTask: "Persuasive signals and missing evidence" },
      { label: "Learn", title: "Use four moves—not one magic checklist", prompt: "Practise: check a fact-checker, find the original, verify the source, and check other independent sources. Decide which move is most useful at each point.", time: "30–35 min", learningMode: "MediaSmarts workshop · modelling · paired rehearsal", studentTask: "A four-move verification flow" },
      { label: "Investigate", title: "Follow the evidence trail", prompt: "Use a teacher-curated claim packet. Trace links and dates, inspect the original evidence, and compare at least two independent sources.", time: "40–50 min", learningMode: "Source investigation · collaborative evidence table", studentTask: "A documented source trail with three pieces of evidence" },
      { label: "Conclude", title: "Supported, contradicted, or still uncertain?", prompt: "Make the most careful conclusion the evidence allows. Explain what is known, what is not, and what evidence would change the judgment.", time: "25–30 min", learningMode: "Evidence conference · written or recorded CER", studentTask: "A calibrated conclusion and uncertainty statement" },
    ],
    resources: [{ label: "Break the Fake", source: "MediaSmarts", url: "https://mediasmarts.ca/break-fake", gradeFit: "Core Grade 6", purpose: "Learn and apply four practical verification moves before sharing or acting on a claim." }],
  },
  {
    id: "perspective-without-guessing", title: "Perspective without guessing", question: "How can we understand a stakeholder’s perspective without inventing what they think?", duration: "2 × 55–65 min", kind: "Stakeholder case",
    learning: "We are learning to infer perspective from evidence about roles, experiences, values, interests, and constraints.",
    success: ["I can distinguish a perspective from a stereotype or unsupported guess.", "I can cite evidence for a stakeholder’s likely priorities.", "I can identify benefits, costs, trade-offs, and missing voices."],
    vocabulary: ["stakeholder", "perspective", "interest", "value", "constraint", "trade-off"], evidenceLevel: "Practice", evidenceSubjects: ["Social Studies", "ELA", "Career"], spacesPrompt: "No post required. Keep the perspective map for the final case file.",
    scenes: [
      { label: "Commit", title: "One change, several possible impacts", prompt: "Respond privately to a fictional Fleetwood street redesign before seeing stakeholder evidence. Then compare how role and experience can change what matters.", time: "20–25 min", learningMode: "Scenario · private response · structured dialogue", studentTask: "An initial decision and reason" },
      { label: "Build", title: "Evidence before empathy claims", prompt: "Use four fictional stakeholder cards. Highlight stated facts, infer possible priorities, and mark what cannot be known from the evidence.", time: "35–40 min", learningMode: "Case cards · evidence coding · perspective map", studentTask: "Four evidence-based perspective profiles" },
      { label: "Test", title: "What happens when the conditions change?", prompt: "Add a new constraint—cost, accessibility, safety, housing, green space, or business access. Identify who benefits, who carries costs, and who is missing.", time: "35–45 min", learningMode: "Decision simulation · trade-off matrix", studentTask: "A revised option with impact analysis" },
      { label: "Deliberate", title: "Disagree without flattening people", prompt: "State evidence, paraphrase another view, ask a genuine question, and revise or qualify one idea.", time: "30–35 min", learningMode: "Deliberation · listening notes · reflection", studentTask: "A reasoned recommendation and one revision" },
    ],
    resources: [
      { label: "Fleetwood community profile", source: "City of Surrey · 2021 Census profile", url: "https://www.surrey.ca/sites/default/files/media/documents/Neighbourhood-Profile-Fleetwood.pdf", gradeFit: "Supported stretch", purpose: "Use dated local demographic evidence carefully; name the year and avoid turning group data into assumptions about individuals." },
      { label: "Fleetwood planning for the future", source: "City of Surrey", url: "https://www.surrey.ca/about-surrey/our-communities/fleetwood", gradeFit: "Core Grade 6", purpose: "Identify public planning priorities and questions connected to local growth and transit." },
    ],
  },
  {
    id: "fleetwood-case-file", title: "Fleetwood evidence & perspective case file", question: "How should Fleetwood respond to growth while caring for people, place, and future needs?", duration: "2–3 × 55–65 min", kind: "Performance task",
    learning: "We are combining maps, public information, stakeholder evidence, and careful reasoning to make a defensible local recommendation.",
    success: ["I can answer a focused question with evidence from meaningfully different sources.", "I can represent perspectives without stereotyping.", "I can explain trade-offs, limits, and what evidence is still missing."],
    vocabulary: ["corroborate", "significance", "cause", "consequence", "ethical judgment", "recommendation"], evidenceLevel: "Portfolio Highlight", evidenceSubjects: ["Social Studies", "ELA", "Arts or ADST"], spacesPrompt: "Post the final case file or link, then individually explain which source changed your thinking, what you contributed, and what remains uncertain.",
    scenes: [
      { label: "Focus", title: "Choose a question small enough to investigate", prompt: "Narrow the broad issue to one decision about mobility, housing, green space, community services, safety, or belonging. Define the place, people, and decision.", time: "30–35 min", learningMode: "Question clinic · teacher conference", studentTask: "One focused inquiry question and working plan" },
      { label: "Research", title: "Build a case—not a link pile", prompt: "Collect evidence from at least three meaningfully different sources. Record creator, date, purpose, useful evidence, and limitation as you work.", time: "55–65 min", learningMode: "Paired research · source conferences", studentTask: "A research trail and annotated evidence set" },
      { label: "Reason", title: "Make the trade-offs visible", prompt: "Compare options across affected people, short- and long-term effects, intended and unintended consequences, feasibility, and missing evidence.", time: "40–50 min", learningMode: "Impact matrix · ethical reasoning · peer challenge", studentTask: "A transparent decision matrix and draft recommendation" },
      { label: "Communicate", title: "Create a case file another person can audit", prompt: "Build a concise paper, audio, video, slide, poster, or Minecraft-supported explanation. Cite evidence and include one serious limitation.", time: "55–65 min", learningMode: "Choice product · feedback · revision", studentTask: "A revised case file and two-minute explanation" },
      { label: "Reflect", title: "Show your individual thinking", prompt: "Explain which source changed or complicated your thinking, what you contributed, and what evidence would make the recommendation stronger.", time: "20–25 min", learningMode: "Individual writing or recording · SpacesEDU", studentTask: "An individual portfolio reflection" },
    ],
    resources: [
      { label: "Fleetwood Plan", source: "City of Surrey", url: "https://fleetwoodplan.surrey.ca/", gradeFit: "Core Grade 6", purpose: "Use the plan and mapping tool as one public-government source—not the only perspective." },
      { label: "Fleetwood community profile", source: "City of Surrey · 2021 Census profile", url: "https://www.surrey.ca/sites/default/files/media/documents/Neighbourhood-Profile-Fleetwood.pdf", gradeFit: "Supported stretch", purpose: "Use local demographic evidence with the year and source clearly named." },
      { label: "First Peoples’ Map of B.C.", source: "First Peoples’ Cultural Council", url: "https://maps.fpcc.ca/", gradeFit: "Core Grade 6", purpose: "Keep Indigenous languages, communities, and place knowledge visible while recognizing that one map cannot replace relationship or Nation-specific learning." },
    ],
  },
];
