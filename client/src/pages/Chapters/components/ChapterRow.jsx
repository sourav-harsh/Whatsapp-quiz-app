import { FaRegFileLines } from "react-icons/fa6";
import ListRow from "../../../utils/ListRow.jsx";
import {countQuestionsByChapter, countQuestionsByExam} from "../../../utils/db.js";
import {useEffect, useState} from "react";

export default function ChapterRow({ chapter, onSelect }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const loadCount = async () => {
            const total = await countQuestionsByChapter(chapter._id);

            if (!cancelled) {
                setTotal(total.data);
            }
        };

        loadCount();

        return () => {
            cancelled = true;
        };
    }, []);
  return (
    <ListRow
      title={`${chapter.order}. ${chapter.name}`}
      subtitle={`${total} questions · ~${chapter.duration_min} min`}
      icon={<FaRegFileLines className="h-5 w-5" />}
      color="#075E54"
      onClick={onSelect}
      disabled={total === 0}
    />
  );
}
