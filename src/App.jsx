import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import {
  ApplicationsPage,
  ApplyPage,
  AuthPage,
  HomePage,
  JobDetailsPage,
  JobsPage,
  NotFoundPage,
  PostJobPage,
  ProfilePage,
} from "./pages/Pages.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="/apply/:jobId" element={<ApplyPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
