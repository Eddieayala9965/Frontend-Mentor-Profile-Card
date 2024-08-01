import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
