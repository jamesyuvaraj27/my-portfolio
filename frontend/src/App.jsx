import { Route, Routes } from "react-router";

import ErrorBoundary from "./components/ErrorBoundary";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
