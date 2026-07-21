import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import GithubCallback from "./components/GithubCallback";
import DiscordCallback from "./components/DiscordCallback";
import MeetingsPage from "./components/MeetingsPage";
import PublicMeetingList from "./components/PublicMeetingList";
import CreateMeetingForm from "./components/CreateMeetingForm";
import MyMeetingsPage from "./components/MyMeetingsPage";
import PastMeetingsPage from "./components/PastMeetingsPage";
import About from "./components/About";
import Map from "./components/Map";
import MeetingDetailPage from "./components/MeetingDetailPage";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function MapPage() {
  return (
    <div className="h-[calc(100vh-5rem)] bg-gray-900">
      <Map />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/oauth/github/callback" element={<GithubCallback />} />
      <Route path="/oauth/discord/callback" element={<DiscordCallback />} />

      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <MeetingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/meetings/public" element={<PublicMeetingList />} />
        <Route
          path="/meetings/create"
          element={
            <ProtectedRoute>
              <CreateMeetingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/mine"
          element={
            <ProtectedRoute>
              <MyMeetingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/past"
          element={
            <ProtectedRoute>
              <PastMeetingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/meeting/:id"
          element={
            <ProtectedRoute>
              <MeetingDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}