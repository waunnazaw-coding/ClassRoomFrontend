import React, { Suspense, lazy, ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import PrivateRoute from "../components/auth/PrivateRoute"; // adjust path

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress size={60} color="primary" />
  </Box>
);

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
);

const RootLayoutPage = lazy(() => import("../pages/RootLayout"));
const HomePage = lazy(() => import("../pages/Home"));
const ErrorPage = lazy(() => import("../pages/Error"));
const ToDoPage = lazy(() => import("../pages/classes/ToDo"));
const ArchievedPage = lazy(() => import("../pages/archived/ArchivedClass"));
const ClassRootLayout = lazy(() => import("../pages/classes/ClassRootLayout"));
const ClassPage = lazy(() => import("../pages/classes/Class"));
const ReviewPage = lazy(() => import("../pages/classes/ToReview"));
const ClassDetailPage = lazy(() => import("../pages/classes/ClassDetial"));
const NotificationPage = lazy(
  () => import("../pages/notification/Notification"),
);
const AssignmentDetail = lazy(
  () => import("@/pages/assignments/AssignmentDetail"),
);
const InboxPage = lazy(() => import("../pages/inbox/Inbox"));
const LoginPage = lazy(() => import("../pages/auth/SigIn"));
const SignUpPage = lazy(() => import("../pages/auth/SignUp"));

const accessToken = localStorage.getItem("authToken") || "";

const router = createBrowserRouter([
  // Root layout with public home page and error page
  {
    path: "/",
    element: withSuspense(<RootLayoutPage />),
    errorElement: withSuspense(<ErrorPage />),
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
      },
    ],
  },

  // Login and Signup routes without RootLayout (no header/sidebar)
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/signup",
    element: withSuspense(<SignUpPage />),
  },

  // Private routes wrapped in PrivateRoute and RootLayout
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: withSuspense(<RootLayoutPage />),
        errorElement: withSuspense(<ErrorPage />),
        children: [
          {
            path: "classes",
            element: withSuspense(<ClassRootLayout />),
            children: [
              {
                index: true,
                element: withSuspense(<ClassPage />),
              },
              {
                path: ":classId",
                element: withSuspense(<ClassDetailPage />),
                // children: [],
              },
            ],
          },
          {
            path: "classes/:classId/assignment/:assignmentId",
            element: withSuspense(<AssignmentDetail />),
          },
          {
            path: "classes/:classId/material/:materialId",
            element: withSuspense(<AssignmentDetail />),
          },
          {
            path: "todo",
            element: withSuspense(<ToDoPage />),
          },
          {
            path: "review",
            element: withSuspense(<ReviewPage />),
          },
          {
            path: "notification",
            element: withSuspense(<NotificationPage token={accessToken} />),
          },
          {
            path: "archived",
            element: withSuspense(<ArchievedPage />),
          },
          {
            path: "inbox",
            element: withSuspense(<InboxPage />),
          },
        ],
      },
    ],
  },

  // // Catch-all redirect to home
  // {
  //   path: "*",
  //   element: <Navigate to="/" replace />,
  // },
]);

export default router;
