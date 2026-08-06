import { useNavigate, useParams } from "react-router-dom";
import { getChaptersBySubject, getExamById, getSubjectById } from "../../utils/db.js";
import ChatHeader from "../../utils/ChatHeader.jsx";
import PageShell from "../../utils/PageShell.jsx";
import EmptyState from "../../utils/EmptyState.jsx";
import ChapterRow from "./components/ChapterRow.jsx";
import {useEffect, useState} from "react";

export default function ChaptersPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [exam, setExam] = useState(null);
  const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const loadData = async () =>{
            const subject = await getSubjectById(subjectId);
            const exam = subject ? await getExamById(subject.data.exam_id) : null;
            const chapters = subject ? await getChaptersBySubject(subjectId) : [];
            setSubject(subject?.data);
            setExam(exam?.data);
            setChapters(chapters?.data);
        }

        loadData();
    }, []);



  return (
    <PageShell
      header={
        <ChatHeader
          title={subject ? subject.name : "Subject"}
          subtitle={exam ? exam.name : "Not found"}
          backTo={subject ? `/exams/${subject.exam_id}/subjects` : "/exams"}
        />
      }
    >
      {!subject ? (
        <EmptyState title="Subject not found" description="Go back and pick a subject." />
      ) : (
        <>
          <p className="wa-bubble animate-pop">
            Each chapter is a short quiz. One question at a time, single correct answer, and no
            negative marking.
          </p>
          {chapters.map((chapter) => (
            <ChapterRow
              key={chapter._id}
              chapter={chapter}
              onSelect={() => navigate(`/chapters/${chapter._id}/quiz`)}
            />
          ))}
        </>
      )}
    </PageShell>
  );
}
