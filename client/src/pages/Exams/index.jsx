import { useNavigate } from "react-router-dom";
import { getExams, getMeta } from "../../utils/db.js";
import { useAuth } from "../../utils/AuthContext.jsx";
import ChatHeader from "../../utils/ChatHeader.jsx";
import PageShell from "../../utils/PageShell.jsx";
import ExamRow from "./components/ExamRow.jsx";
import {useEffect, useState} from "react";

export default function ExamsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exams, setExams] = useState();
  const meta = getMeta();

    useEffect(() => {
        const loadData = async () => {
            const exam = await getExams();
            setExams(exam.data);
        };

        loadData();
    }, []);

  return (
    <PageShell
      header={
        <ChatHeader
          title="Exams"
          subtitle={`Signed in as ${user?.name}`}
          showBack={false}
        />
      }
    >
      <p className="wa-bubble animate-pop">
        Hi {user?.name?.split(" ")[0]} 👋 Choose an exam to start practising. There are{" "}
        {meta.questions} questions across {meta.subjects} subjects and {meta.chapters} chapters.
      </p>

      {exams?.map((exam) => (
        <ExamRow
          key={exam._id}
          exam={exam}
          onSelect={() => navigate(`/exams/${exam._id}/subjects`)}
        />
      ))}
    </PageShell>
  );
}
