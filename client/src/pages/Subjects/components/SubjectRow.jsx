import { FaLayerGroup } from "react-icons/fa6";
import ListRow from "../../../utils/ListRow.jsx";
import {countChaptersBySubject, countQuestionsByChapter, countQuestionsBySubject} from "../../../utils/db.js";
import {useEffect, useState} from "react";

const PALETTE = ["#128C7E", "#25D366", "#075E54", "#34B7F1", "#9B5DE5", "#EF7C1B"];

export default function SubjectRow({ subject, onSelect }) {
  const color = PALETTE[(subject.order - 1) % PALETTE.length];
    const [chapter, setChapter] = useState(0);
    const [question, setQuestion] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const loadCount = async () => {
            const chapter = await countChaptersBySubject(subject._id);
            const question =await countQuestionsBySubject(subject._id)

            if (!cancelled) {
                setChapter(chapter.data)
                setQuestion(question.data)
            }
        };

        loadCount();

        return () => {
            cancelled = true;
        };
    }, []);

  return (
    <ListRow
      title={subject.name}
      subtitle={`${chapter} chapters · ${question} questions`}
      icon={<FaLayerGroup className="h-5 w-5" />}
      color={color}
      onClick={onSelect}
    />
  );
}
