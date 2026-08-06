/**
 * Tiny data-access layer over the seeded database (src/data/db.json).
 * In a real app these functions would be API calls.
 */
import db from "../data/db.json";

export const getMeta = () => db.meta;

export const getUsers = async () => {
    const res = await fetch("http://localhost:80/api/v1/auth/users");
    return res.json();
};

export const getExams = async () => {
    const res = await fetch("http://localhost:80/api/v1/exams/");
    return res.json();
};

export const getUserById = (userId) => db.users.find((u) => u.id === userId) || null;

// export const getExams = () => db.exams;

// export const getExamById = (examId) => db.exams.find((e) => e.id === examId) || null;

export const getExamById = async (examId) => {
    const res = await fetch(`http://localhost:80/api/v1/exams/${examId}`);
    return res.json();
}

// export const getSubjectsByExam = (examId) =>
//     db.subjects.filter((s) => s.examId === examId).sort((a, b) => a.order - b.order);

export const getSubjectsByExam = async (examId) => {
    const res = await fetch(`http://localhost:80/api/v1/exams/${examId}/subjects`);
    return res.json();
}

// export const getSubjectById = (subjectId) =>
//     db.subjects.find((s) => s.id === subjectId) || null;

export const getSubjectById = async (subjectId) => {
    const res = await fetch(`http://localhost:80/api/v1/subjects/${subjectId}`);
    return res.json();
}

// export const getChaptersBySubject = (subjectId) =>
//     db.chapters.filter((c) => c.subjectId === subjectId).sort((a, b) => a.order - b.order);

export const getChaptersBySubject = async (subjectId) => {
    const res = await fetch(`http://localhost:80/api/v1/subjects/${subjectId}/chapters`);
    return res.json();
}

// export const getChapterById = (chapterId) =>
//     db.chapters.find((c) => c.id === chapterId) || null;

export const getChapterById = async (chapterId) => {
    const res = await fetch(`http://localhost:80/api/v1/chapters/${chapterId}`);
    return res.json();
}

// export const getQuestionsByChapter = (chapterId) =>
//     db.questions.filter((q) => q.chapterId === chapterId);

export const getQuestionsByChapter = async (chapterId) => {
    const res = await fetch(`http://localhost:80/api/v1/chapters/${chapterId}/questions`);
    return res.json();
}

export const countQuestionsByChapter = async (chapterId) => {
    const res = await getQuestionsByChapter(chapterId);
    return res?.length || 0;
}

// export const countQuestionsBySubject = (subjectId) =>
//     db.questions.filter((q) => q.subjectId === subjectId).length;

const getQuestionsBySubject = async (subjectId) => {
    const res = await fetch(`http://localhost:80/api/v1/subjects/${subjectId}/questions`);
    return res.json();
}

export const countQuestionsBySubject = async (subjectId) => {
    const res = await getQuestionsBySubject(subjectId);
    return res?.length || 0;
}

export const countChaptersBySubject = async (subjectId) => {
    const res = await getChaptersBySubject(subjectId);
    return res?.length || 0;
}

// export const countQuestionsByExam = (examId) =>
//     db.questions.filter((q) => q.examId === examId).length;

const getQuestionByExamId = async (examId) => {
    const res = await fetch(`http://localhost:80/api/v1/exams/${examId}/questions`);
    return res.json();
}
export const countQuestionsByExam = async (examId) => {
    const res = await getQuestionByExamId(examId);
    // console.log("res", res);
    return res?.data?.length || 0;
}

export const submitQuestionAnswer = async (userId, questionId, examId, subjectId, chapterId, selectedOptionId, questionShownTime, answerSubmittedTime) => {
    const data = {
        "user_id": userId,
        "question_id": questionId,
        "exam_id": examId,
        "subject_id": subjectId,
        "chapter_id": chapterId,
        "selected_option_id": selectedOptionId,
        "question_shown_time": questionShownTime,
        "answer_submitted_time": answerSubmittedTime
    }
    const res = await fetch('http://localhost:80/api/v1/attempts/submit-answer', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res.json();
}
