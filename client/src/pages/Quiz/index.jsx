import {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {FaPaperPlane} from "react-icons/fa6";
import {
    getChapterById,
    getQuestionsByChapter,
    getSubjectById,
    getUsers,
    submitQuestionAnswer,
} from "../../utils/db.js";
import {session, STORAGE_KEYS} from "../../utils/storage.jsx";
import ChatHeader from "../../utils/ChatHeader.jsx";
import PageShell from "../../utils/PageShell.jsx";
import EmptyState from "../../utils/EmptyState.jsx";
import QuizProgress from "./components/QuizProgress.jsx";
import QuestionBubble from "./components/QuestionBubble.jsx";
import OptionList from "./components/OptionList.jsx";
import {useAuth} from "../../utils/AuthContext.jsx";

export default function QuizPage() {
    const {chapterId} = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [subject, setSubject] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [questionShownTime, setQuestionShownTime] = useState(null);
    const [answers, setAnswers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            const chapter = await getChapterById(chapterId);
            const subject = chapter
                ? await getSubjectById(chapter.data.subject_id)
                : null;

            const questions = chapter
                ? await getQuestionsByChapter(chapterId)
                : [];

            setChapter(chapter?.data);
            setSubject(subject?.data);
            setQuestions(questions?.data);
        };

        loadData();
    }, [chapterId]);

    useEffect(() => {
            setQuestionShownTime(new Date().toISOString());
    }, [index]);

    if (!chapter || questions.length === 0) {
        // console.log("<<<<Chapter>>>",chapter,"<<<<questions>>>",questions)
        return (
            <PageShell header={<ChatHeader title="Quiz" subtitle="Not found" backTo="/exams"/>}>
                <EmptyState title="Quiz unavailable" description="This chapter has no questions yet."/>
            </PageShell>
        );
    }

    const question = questions[index];
    const isLast = index === questions.length - 1;

    const handleNext = async () => {
        try{
        if (!selectedOptionId) return;

        const answerSubmittedTime = new Date().toISOString();
        const submitAnswerResponse= await submitQuestionAnswer(user._id, question._id, chapter.exam_id, chapter.subject_id, chapter._id, selectedOptionId, questionShownTime, answerSubmittedTime)

        const isCorrect = submitAnswerResponse.data.is_correct;
        const record = {
            questionId: question._id,
            questionText: question.text,
            selectedOptionId,
            selectedOptionText: question.options.find((o) => o.id === selectedOptionId)?.text || "",
            correctOptionId: submitAnswerResponse.data.correct_option_id,
            correctOptionText: question.options.find((o) => o.id === submitAnswerResponse.data.correct_option_id)?.text || "",
            explanation: question.explanation,
            isCorrect,
        };
        const nextAnswers = [...answers, record];

        if (isLast) {
            const correct = nextAnswers.filter((a) => a.isCorrect).length;
            const result = {
                chapterId: chapter._id,
                chapterName: chapter.name,
                subjectId: chapter.subject_id,
                subjectName: subject?.name || "",
                examId: chapter.exam_id,
                total: questions.length,
                correct,
                wrong: questions.length - correct,
                score: correct,
                percentage: Math.round((correct / questions.length) * 100),
                completedAt: new Date().toISOString(),
                answers: nextAnswers,
            };
            session.set(STORAGE_KEYS.lastResult, result);
            navigate(`/chapters/${chapter._id}/result`, {replace: true, state: {result}});
            return;
        }

        setAnswers(nextAnswers);
        setIndex((i) => i + 1);
        setSelectedOptionId(null);
        setQuestionShownTime(null);
            console.log("record>>>>",record)
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

    // console.log("<<<<Chapter>>>",chapter,"<<<<questions>>>",questions)
    return (
        <PageShell
            header={
                <ChatHeader
                    title={chapter.name}
                    subtitle={`${subject?.name || "Quiz"} · Question ${index + 1} of ${questions.length}`}
                    backTo={`/subjects/${chapter.subject_id}/chapters`}
                />
            }
            footer={
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-wa-muted">
                        {selectedOptionId ? "Answer locked in — tap Next." : "Select one option to continue."}
                    </p>
                    <button type="button" onClick={handleNext} disabled={!selectedOptionId} className="wa-btn">
                        {isLast ? "Submit" : "Next"}
                        <FaPaperPlane className="h-3.5 w-3.5"/>
                    </button>
                </div>
            }
        >
            <QuizProgress current={index + 1} total={questions.length}/>
            <QuestionBubble
                number={index + 1}
                total={questions.length}
                text={question.text}
                marks={question.marks}
            />
            <OptionList
                options={question.options}
                selectedOptionId={selectedOptionId}
                onSelect={setSelectedOptionId}
            />
            <p className="mx-auto rounded-full bg-white/70 px-3 py-1 text-[11px] text-wa-muted">
                You cannot return to a previous question.
            </p>
        </PageShell>
    );
}
