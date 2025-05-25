import React from "react";
import Stack from "@mui/material/Stack";
import SignInCard from "../../components/auth/SignInCard";
import Content from "../../components/auth/Content";

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  return (
    <Stack
      component="main"
      direction="column"
      sx={[
        {
          justifyContent: "center",
          height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
          marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
          minHeight: "100%",
          position: "relative", // Needed for ::before positioning
          overflow: "hidden", // Prevent scrollbars from background pseudo-element
        },
        (theme) => ({
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
            backgroundRepeat: "no-repeat",
            ...theme.applyStyles("dark", {
              backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
            }),
          },
        }),
      ]}
    >
      {/* Outer container for responsive layout */}
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          gap: { xs: 6, sm: 12 },
          p: 2,
          mx: "auto",
          width: "100%",
          maxWidth: 1200, // Optional max width for large screens
        }}
      >
        {/* Inner container for Content and SignInCard */}
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: "auto",
            width: "100%",
          }}
        >
          <Content />
          <SignInCard />
        </Stack>
      </Stack>
    </Stack>
  );
}
