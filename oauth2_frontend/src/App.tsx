import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./store/authStore";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {retry: 1, staleTime: 1000 * 60}
  },
})

const theme = createTheme({
  palette: {primary: {main: '#1976d2'}}
});

interface RouteGuardProps {
  children: ReactNode;
}

function PrivateRoute({children}: RouteGuardProps) {
  const {isLoggedIn} = useAuth();
  return isLoggedIn? <>{children}</> : <Navigate to='/login' replace />
}

function GuestRoute({children}: RouteGuardProps) {
  const {isLoggedIn} = useAuth();
  return isLoggedIn ? <Navigate to='/' replace /> : <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
  )
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
