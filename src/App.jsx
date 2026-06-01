import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { getToken } from "./models/token";

import ProjectView from "./pages/ProjectView";
import EditorView from "./pages/EditorView";
import ProfileView from "./pages/ProfileView";

import ProjectList from "./components/ProjectList";
import CreateProjectForm from "./components/CreateProjectForm";
import ShareProjectForm from "./components/ShareProjectForm";
import { ActiveUserWrapper } from "./contexts/ActiveUserWrapper";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const userToken = getToken();

  const isLoggedIn = userToken !== null && userToken !== "";

  return isLoggedIn ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

function AppContent() {
  useLocation();

  const isLoggedIn = !!getToken();

  return (
    <>
      {isLoggedIn && <Header />}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="bg-main min-h-screen text flex flex-col">
                  <div className="flex flex-col items-center w-full mt-10">
                    <div className="w-full max-w-xl px-4">
                      <h1 className="text-2xl font-bold mb-6">Your projects</h1>

                      <ProjectList />
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <div className="bg-main min-h-screen text">Files page coming soon</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <div className="bg-main min-h-screen text flex flex-col">
                  <div className="flex flex-col items-center w-full mt-10">
                    <div className="w-full max-w-xl px-4">
                      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

                      <CreateProjectForm />
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:uid"
            element={
              <ProtectedRoute>
                <div className="bg-main min-h-screen text flex flex-col">
                  <ProjectView />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:uid/file/:fid"
            element={
              <ProtectedRoute>
                <div className="bg-main min-h-screen text flex flex-col">
                  <ActiveUserWrapper>
                    <EditorView />
                  </ActiveUserWrapper>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:uid/share"
            element={
              <ProtectedRoute>
                <div className="bg-main min-h-screen text flex flex-col">
                  <ShareProjectForm />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
