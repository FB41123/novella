import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { RootLayout } from "@/layouts/RootLayout";
import { Home } from "@/pages/Home";
import { NovelDetails } from "@/pages/NovelDetails";
import { ChapterReader } from "@/pages/ChapterReader";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { Messages } from "@/pages/Messages";
import { Settings } from "@/pages/Settings";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/RoleGuard";
import { PublicRoute } from "@/components/PublicRoute";
import { Community } from "./pages/Community";
import { Library } from "./pages/Library";
import { EditProfile } from "./pages/EditProfile";
import { CreateNovel } from "@/pages/CreateNovel";
import { ManageNovel } from "./pages/ManageNovel";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminImportNovel } from "./pages/AdminImportNovel";
import { ExternalNovelDetails } from "./pages/ExternalNovelDetails";
import { EditExternalNovel } from "./pages/EditExternalNovel"; // بنسوي هذي الصفحة في الخطوة الرابعة

function App() {
  return (
    <LanguageProvider>
      <SiteSettingsProvider>
        <ThemeProvider defaultTheme="system" storageKey="novella-theme">
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<RootLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/novel/:id" element={<NovelDetails />} />
                  <Route path="/manage-novel/:id" element={<ManageNovel />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/library" element={<Library />} />
                  
                  {/* مسارات عامة (تطردك للرئيسية لو كنت مسجل دخول) */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>
                  
                  {/* مسارات محمية (للمسجلين فقط) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/profile/:id" element={<Profile />} />                  
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* 🚀 مسارات الإدارة العليا فقط (Admin) */}
                    <Route element={<RoleGuard allowedRoles={['admin']} />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/create-novel" element={<AdminImportNovel />} />
                    </Route>

                    {/* 🚀 مسارات مشتركة للكتّاب والمدراء (Writer & Admin) */}
                    <Route element={<RoleGuard allowedRoles={['writer', 'admin']} />}>
                    // ضيف هذي المسارات مع باقي مساراتك
<Route path="/external-novel/:id" element={<ExternalNovelDetails />} />
<Route path="/admin/edit-external/:id" element={<EditExternalNovel />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/create-novel" element={<CreateNovel />} />
                    </Route>
                  </Route>
                </Route>
                
                <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterReader />} />                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </SiteSettingsProvider>
    </LanguageProvider>
  );
}

export default App;