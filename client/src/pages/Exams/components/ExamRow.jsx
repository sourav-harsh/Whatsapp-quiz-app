import { FaBook, FaAtom, FaBuildingColumns } from "react-icons/fa6";
import ListRow from "../../../utils/ListRow.jsx";
import { countQuestionsByExam } from "../../../utils/db.js";
import {useEffect, useState} from "react";

const ICONS = {
  book: <FaBook className="h-5 w-5" />,
  atom: <FaAtom className="h-5 w-5" />,
  bank: <FaBuildingColumns className="h-5 w-5" />,
};

const COLORS = { book: "#128C7E", atom: "#34B7F1", bank: "#EF7C1B" };

export default function ExamRow({ exam, onSelect }) {
    const [count, setCount] = useState(10);

    useEffect(() => {
        let cancelled = false;

        const loadCount = async () => {
            const total = await countQuestionsByExam(exam._id);

            if (!cancelled) {
                setCount(total);
            }
        };

        loadCount();

        return () => {
            cancelled = true;
        };
    }, [exam._id]);

  return (
    <ListRow
      title={exam.name}
      subtitle={exam.tagline}
      meta={`${count} Qs`}
      icon={ICONS[exam.icon] || ICONS.book}
      color={COLORS[exam.icon] || "#128C7E"}
      onClick={onSelect}
    />
  );
}
