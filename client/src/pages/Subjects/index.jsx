import { useNavigate, useParams } from "react-router-dom";
import {getExamById, getExams, getSubjectsByExam} from "../../utils/db.js";
import ChatHeader from "../../utils/ChatHeader.jsx";
import PageShell from "../../utils/PageShell.jsx";
import EmptyState from "../../utils/EmptyState.jsx";
import SubjectRow from "./components/SubjectRow.jsx";
import {useEffect, useState} from "react";

export default function SubjectsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
      const loadData = async () => {
          const exam = await getExamById(examId);
          const subjects = exam ? await getSubjectsByExam(examId) : [];
          setExam(exam?.data);
          setSubjects(subjects?.data);
      };

      loadData();

  }, [examId]);


  return (
    <PageShell
      header={
        <ChatHeader
          title={exam ? exam.name : "Exam"}
          subtitle={exam ? `${subjects?.length} subjects` : "Not found"}
          backTo="/exams"
        />
      }
    >
      {!exam ? (
        <EmptyState title="Exam not found" description="Pick another exam from the list." />
      ) : (
        <>
          <p className="wa-bubble animate-pop">Select a subject to see its chapters.</p>
          {subjects?.map((subject) => (
            <SubjectRow
              key={subject._id}
              subject={subject}
              onSelect={() => navigate(`/subjects/${subject._id}/chapters`)}
            />
          ))}
        </>
      )}
    </PageShell>
  );
}
