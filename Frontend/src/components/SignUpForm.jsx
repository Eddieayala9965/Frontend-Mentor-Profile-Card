import { useState } from "react";
import api from "../services/api";
import { signup } from "../services/authService";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "gray",
              },
              "&.Mui-focused fieldset": {
                borderColor: "gray",
                boxShadow: "none",
              },
            },
            "& .MuiInputLabel-root": {
              color: "gray",
              "&.Mui-focused": {
                color: "red",
              },
            },
          },
        },
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await signup(username, password);
      if (response.ok) {
        setSuccess("Registration successful");
        window.location.href("/profile");
      }
    } catch (error) {
      console.error("failed to sign up. Please try again");
    }
  };

  const handleChangeUser = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePass = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl bg-zinc-800 flex flex-col text-center ">
      <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
      <ThemeProvider theme={theme}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <TextField
              label="Username"
              type="text"
              name="username"
              id="username"
              value={username}
              required
              fullWidth
              onChange={handleChangeUser}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray",
                  },
                  "&:hover fieldset": {
                    borderColor: "gray",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "gray",
                  "&.Mui-focused": {
                    color: "gray",
                  },
                },
              }}
            />
          </div>
          <div>
            <TextField
              label="Password"
              type="password"
              name="password"
              id="password"
              value={password}
              required
              fullWidth
              onChange={handleChangePass}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray",
                  },
                  "&:hover fieldset": {
                    borderColor: "gray",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "gray",
                  "&.Mui-focused": {
                    color: "gray",
                  },
                },
              }}
            />
          </div>
        </form>
        <p className="text-white text-left mt-3">
          Already have an account ? <Link to={"/login"}>Log In</Link>
        </p>
      </ThemeProvider>
    </div>
  );
};

export default SignUpForm;
