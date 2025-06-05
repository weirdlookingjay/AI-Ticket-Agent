import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CheckAuth from "./components/check-auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tickets from "./pages/tickets";
import TicketDetailPage from "./pages/ticket";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Admin from "./pages/admin";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth protected={true}>
              <Tickets />
            </CheckAuth>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protected={true}>
              <TicketDetailPage />
            </CheckAuth>
          }
        />
        <Route
          path="/login"
          element={
            <CheckAuth protected={false}>
              <Login />
            </CheckAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <CheckAuth protected={false}>
              <Signup />
            </CheckAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <CheckAuth protected={true}>
              <Admin />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
