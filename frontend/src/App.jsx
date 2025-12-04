import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import CommunityPage from "./pages/CommunityPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./components/ChatPage";
import PopularPage from "./pages/PopularPage";
import AllPage from "./pages/AllPage";
import ExplorePage from "./pages/ExplorePage";
import CreateCommunityPage from "./pages/CreateCommunityPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* SIDEBAR ROUTES */}
        <Route 
          path="/popular"
          element={
            <MainLayout noRightSidebar={true}>
              <PopularPage />
            </MainLayout>
          }
        />
        <Route
          path="/chat"
          element={
        <MainLayout noRightSidebar={true}>
         <ChatPage />
        </MainLayout>
            }
        />

        <Route
          path="/all"
          element={
            <MainLayout  >
              <AllPage />
            </MainLayout>
          }
        />

        <Route
          path="/explore"
          element={
            <MainLayout noRightSidebar={true}>
              <ExplorePage />
            </MainLayout>
          }
        />

        <Route
          path="/create-community"
          element={
            <MainLayout noRightSidebar={true}>
              <CreateCommunityPage />
            </MainLayout>
          }
        />

        {/* MAIN PAGES */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/post/:id"
          element={
            <MainLayout>
              <PostPage />
            </MainLayout>
          }
        />

        <Route
          path="/r/:name"
          element={
            <MainLayout noRightSidebar={true}>
              <CommunityPage />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
