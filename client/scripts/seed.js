/**
 * Seed script — populates the local "database" (src/data/db.json)
 * with 50 users, 3 exams, 10 subjects, 30 chapters and 500 questions.
 *
 * Run: npm run seed
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "src", "data");
const OUT_FILE = path.join(OUT_DIR, "db.json");

/* ---------------------------------- rng --------------------------------- */
let seedValue = 20260803;
const rand = () => {
  seedValue = (seedValue * 1664525 + 1013904223) % 4294967296;
  return seedValue / 4294967296;
};
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const int = (min, max) => min + Math.floor(rand() * (max - min + 1));

/* --------------------------------- users -------------------------------- */
const FIRST = ["Aarav","Isha","Rohan","Meera","Kabir","Ananya","Vivaan","Diya","Arjun","Sara","Neel","Tara","Karan","Nisha","Dev","Riya","Yash","Mira","Aditya","Pooja","Zara","Omkar","Kavya","Rahul","Sneha"];
const LAST = ["Sharma","Verma","Iyer","Nair","Khan","Patel","Reddy","Bose","Gupta","Mehta"];
const STATUS = ["Available","Busy studying 📚","At the library","Prepping for finals","Only quizzes, no chats","Learning something new","Focus mode on","Back in 5 minutes"];

const users = Array.from({ length: 50 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 3) % LAST.length];
  const name = `${first} ${last}`;
  return {
    id: `user-${i + 1}`,
    name,
    initials: `${first[0]}${last[0]}`,
    phone: `+91 9${String(700000000 + i * 137911).slice(0, 9)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@quizchat.app`,
    status: STATUS[i % STATUS.length],
    lastSeen: `${int(1, 59)} min ago`,
    accent: ["#128C7E", "#25D366", "#075E54", "#34B7F1", "#EF7C1B", "#9B5DE5"][i % 6],
  };
});

/* --------------------------------- exams -------------------------------- */
const examBlueprint = [
  {
    id: "exam-1",
    name: "UPSC Prelims",
    tagline: "General Studies foundation track",
    icon: "book",
    subjects: [
      { name: "Indian Polity", chapters: ["Constitutional Framework", "Fundamental Rights", "Parliament"] },
      { name: "Modern History", chapters: ["Revolt of 1857", "Freedom Movement", "Post Independence"] },
      { name: "Geography", chapters: ["Physical Geography", "Indian Rivers", "Climatology"] },
      { name: "Economy", chapters: ["Basics of Economy", "Banking & Finance", "Budget & Taxation"] },
    ],
  },
  {
    id: "exam-2",
    name: "JEE Main",
    tagline: "Engineering entrance practice",
    icon: "atom",
    subjects: [
      { name: "Physics", chapters: ["Kinematics", "Laws of Motion", "Optics"] },
      { name: "Chemistry", chapters: ["Atomic Structure", "Chemical Bonding", "Organic Basics"] },
      { name: "Mathematics", chapters: ["Quadratic Equations", "Calculus", "Probability"] },
    ],
  },
  {
    id: "exam-3",
    name: "Banking (IBPS PO)",
    tagline: "Aptitude, reasoning and awareness",
    icon: "bank",
    subjects: [
      { name: "Quantitative Aptitude", chapters: ["Number System", "Percentages", "Data Interpretation"] },
      { name: "Reasoning Ability", chapters: ["Syllogism", "Puzzles", "Coding-Decoding"] },
      { name: "English Language", chapters: ["Reading Comprehension", "Error Spotting", "Cloze Test"] },
    ],
  },
];

const exams = [];
const subjects = [];
const chapters = [];

examBlueprint.forEach((exam) => {
  exams.push({
    id: exam.id,
    name: exam.name,
    tagline: exam.tagline,
    icon: exam.icon,
    subjectCount: exam.subjects.length,
  });
  exam.subjects.forEach((subject, sIdx) => {
    const subjectId = `subject-${subjects.length + 1}`;
    subjects.push({
      id: subjectId,
      examId: exam.id,
      name: subject.name,
      description: `${subject.chapters.length} chapters curated for ${exam.name}.`,
      order: sIdx + 1,
    });
    subject.chapters.forEach((chapter, cIdx) => {
      chapters.push({
        id: `chapter-${chapters.length + 1}`,
        subjectId,
        examId: exam.id,
        name: chapter,
        order: cIdx + 1,
        durationMin: int(8, 20),
      });
    });
  });
});

/* ------------------------------- questions ------------------------------ */
const TEMPLATES = [
  (c, n) => `Which of the following statements about ${c} is correct? (Set ${n})`,
  (c, n) => `In the context of ${c}, identify the most accurate option. (Set ${n})`,
  (c, n) => `${c}: which option best completes the concept? (Set ${n})`,
  (c, n) => `A student studying ${c} asks — which of these is TRUE? (Set ${n})`,
  (c, n) => `Choose the correct definition related to ${c}. (Set ${n})`,
];
const OPTION_STEMS = [
  "It is directly derived from the core principle of the topic.",
  "It applies only under exceptional, undocumented conditions.",
  "It contradicts the standard definition taught in this chapter.",
  "It is a common misconception frequently seen in mock tests.",
  "It holds true for every case without any exception.",
  "It is valid only when the supporting assumption fails.",
];

const questions = [];
const TOTAL_QUESTIONS = 500;
const perChapter = Math.floor(TOTAL_QUESTIONS / chapters.length); // 16
let remainder = TOTAL_QUESTIONS - perChapter * chapters.length;

chapters.forEach((chapter) => {
  let count = perChapter;
  if (remainder > 0) {
    count += 1;
    remainder -= 1;
  }
  for (let q = 0; q < count; q += 1) {
    const correctIndex = int(0, 3);
    // distinct distractors, no repeated option text within a question
    const pool = OPTION_STEMS.slice(1);
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    let distractor = 0;
    const options = Array.from({ length: 4 }, (_, oIdx) => ({
      id: `opt-${oIdx + 1}`,
      text:
        oIdx === correctIndex
          ? `${chapter.name} — ${OPTION_STEMS[0]}`
          : `${chapter.name} — ${pool[distractor++]}`,
    }));
    questions.push({
      id: `question-${questions.length + 1}`,
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      examId: chapter.examId,
      text: pick(TEMPLATES)(chapter.name, q + 1),
      options,
      correctOptionId: options[correctIndex].id,
      explanation: `The correct choice follows directly from the definition covered in "${chapter.name}". The remaining options describe partial or inverted statements.`,
      marks: 1,
      negativeMarks: 0,
    });
  }
});

/* --------------------------------- write -------------------------------- */
const db = {
  generatedAt: new Date().toISOString(),
  meta: {
    users: users.length,
    exams: exams.length,
    subjects: subjects.length,
    chapters: chapters.length,
    questions: questions.length,
  },
  users,
  exams,
  subjects,
  chapters,
  questions,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(db, null, 2));

console.log("Seed complete →", OUT_FILE);
console.table(db.meta);
