import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/authService";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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
      if (response.status === 200 || response.status === 201) {
        setSuccess("Registration successful");
        setOpen(true);
        e;
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Failed to sign up. Please try again.");
        setOpen(true);
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
              autoComplete="username"
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
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
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              required
              autoComplete="current-password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
          <Button
            type="submit"
            sx={{
              color: "white",
              fontFamily: "inherit",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            Submit
          </Button>
        </form>
        <p className="text-white text-left mt-3">
          Already have an account? <Link to={"/login"}>Log In</Link>
        </p>
      </ThemeProvider>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignUpForm;
