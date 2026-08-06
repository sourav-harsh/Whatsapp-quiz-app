import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import NotFound from "./utils/NotFound.jsx";
import LoginPage from "./pages/Login/index.jsx";
import ExamsPage from "./pages/Exams/index.jsx";
import SubjectsPage from "./pages/Subjects/index.jsx";
import ChaptersPage from "./pages/Chapters/index.jsx";
import QuizPage from "./pages/Quiz/index.jsx";
import ResultPage from "./pages/Result/index.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/exams" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ExamsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/:examId/subjects"
        element={
          <ProtectedRoute>
            <SubjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects/:subjectId/chapters"
        element={
          <ProtectedRoute>
            <ChaptersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chapters/:chapterId/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chapters/:chapterId/result"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
