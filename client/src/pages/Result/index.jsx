import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaRotateRight, FaListUl } from "react-icons/fa6";
import { STORAGE_KEYS, session } from "../../utils/storage.jsx";
import ChatHeader from "../../utils/ChatHeader.jsx";
import PageShell from "../../utils/PageShell.jsx";
import EmptyState from "../../utils/EmptyState.jsx";
import ScoreCard from "./components/ScoreCard.jsx";
import AnswerReview from "./components/AnswerReview.jsx";

export default function ResultPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stored = session.get(STORAGE_KEYS.lastResult, null);
  const result = location.state?.result || (stored && stored.chapterId === chapterId ? stored : null);

  if (!result) {
    return (
      <PageShell header={<ChatHeader title="Result" subtitle="No attempt found" backTo="/exams" />}>
        <EmptyState title="No result to show" description="Take a quiz first to see your score." />
      </PageShell>
    );
  }

  return (
    <PageShell
      header={
        <ChatHeader
          title="Result"
          subtitle={`${result.subjectName} · ${result.chapterName}`}
          backTo={`/subjects/${result.subjectId}/chapters`}
        />
      }
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="wa-btn-ghost"
            onClick={() => navigate(`/subjects/${result.subjectId}/chapters`)}
          >
            <FaListUl className="h-3.5 w-3.5" />
            All chapters
          </button>
          <button
            type="button"
            className="wa-btn"
            onClick={() => navigate(`/chapters/${result.chapterId}/quiz`, { replace: true })}
          >
            <FaRotateRight className="h-3.5 w-3.5" />
            Retake quiz
          </button>
        </div>
      }
    >
      <ScoreCard result={result} />
      <p className="wa-bubble animate-pop">Here is a breakdown of every question you attempted.</p>
      {result.answers.map((answer, idx) => (
        <AnswerReview key={answer.questionId} answer={answer} index={idx + 1} />
      ))}
    </PageShell>
  );
}
