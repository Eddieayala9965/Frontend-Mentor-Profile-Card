import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";

import "./index.css";

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
    </Routes>
    <Routes>
      <Route
        path="/signup"
        element={
          <Layout>
            <SignUpForm />
          </Layout>
        }
      />
    </Routes>
    <Routes>
      <Route
        path="/login"
        element={
          <Layout>
            <LoginForm />
          </Layout>
        }
      />
    </Routes>
  </Router>
);

export default App;
