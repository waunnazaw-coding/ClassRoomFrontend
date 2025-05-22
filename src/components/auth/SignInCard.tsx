import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { authService } from "../../services/auth"; // adjust path

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignInCard() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email address.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const authResponse = await authService.login({
        email,
        password,
        rememberMe,
      });
      localStorage.setItem("authToken", authResponse.accessToken);
      toast.success("Login successful!");
      // Navigate after a short delay to allow toast to show
      setTimeout(() => {
        navigate("/");
      });
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Login failed.");
      toast.error(serverError || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined" aria-label="Sign in form">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl fullWidth>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            required
            autoComplete="email"
            variant="outlined"
            size="small"
          />
        </FormControl>

        <FormControl fullWidth>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <Button
              type="button"
              onClick={handleClickOpen}
              variant="text"
              sx={{
                fontWeight: "medium",
                textTransform: "none",
                padding: 0,
                minWidth: "unset",
              }}
            >
              Forgot your password?
            </Button>
          </Box>
          <TextField
            id="password"
            name="password"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            required
            autoComplete="current-password"
            variant="outlined"
            size="small"
          />
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label="Remember me"
        />

        {serverError && (
          <Typography color="error" variant="body2" textAlign="center">
            {serverError}
          </Typography>
        )}

        <ForgotPassword open={open} handleClose={handleClose} />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ fontWeight: "bold" }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Typography component={Link} to="/signup" variant="body2">
            Sign Up
          </Typography>
        </Typography>
      </Box>
    </Card>
  );
}
