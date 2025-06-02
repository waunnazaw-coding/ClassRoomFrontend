import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { authService } from "../../services/auth"; // Adjust path

// Styled Card
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
}));

// Zod validation schema
const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export default function SignUpCard() {
  const navigate = useNavigate();

  const [serverError, setServerError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  // Clear server error when input changes
  React.useEffect(() => {
    setServerError("");
  }, [watch()]);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (
    data,
    event?: React.BaseSyntheticEvent,
  ) => {
    event?.preventDefault(); // Prevent default form submit behavior
    setServerError("");
    setSuccess(false);

    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccess(true);
      reset();
      navigate("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Registration failed";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <Card variant="outlined" aria-label="Sign up form">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign Up
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl fullWidth>
          <FormLabel htmlFor="name">Name</FormLabel>
          <TextField
            id="name"
            required
            placeholder="John Doe"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            autoComplete="name"
            variant="outlined"
            size="small"
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            type="email"
            required
            placeholder="your@email.com"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            variant="outlined"
            size="small"
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            id="password"
            required
            type={showPassword ? "text" : "password"}
            placeholder="••••••"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="new-password"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <TextField
            id="confirmPassword"
            required
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirmPassword((show) => !show)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {serverError && (
          <Typography color="error" variant="body2" textAlign="center">
            {serverError}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{ fontWeight: "bold" }}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>

        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Typography
            component={Link}
            to="/login"
            variant="body2"
            sx={{ cursor: "pointer" }}
          >
            Sign In
          </Typography>
        </Typography>
      </Box>
    </Card>
  );
}
