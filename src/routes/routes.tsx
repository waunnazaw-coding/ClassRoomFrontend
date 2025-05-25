import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// Lazy load all page components
const RootLayoutPage = lazy(() => import("../pages/RootLayout"));
const HomePage = lazy(() => import("../pages/Home"));
const ErrorPage = lazy(() => import("../pages/Error"));
// const CalendarPage = lazy(() => import("../pages/calendar/Calendar"));
const ToDoPage = lazy(() => import("../pages/classes/ToDo"));
const ArchievedPage = lazy(() => import("../pages/archived/ArchivedClass"));
const ClassRootLayout = lazy(() => import("../pages/classes/ClassRootLayout"));
const ClassPage = lazy(() => import("../pages/classes/Class"));
const ReviewPage = lazy(() => import("../pages/classes/ToReview"));
const ClassDetailPage = lazy(() => import("../pages/classes/ClassDetial"));
const NotificationPage = lazy(
  () => import("../pages/notification/Notification"),
);
const AssignmentDetail = lazy(() => import("../pages/assignments/Assignment"));
const InboxPage = lazy(() => import("../pages/inbox/Inbox"));
const LoginPage = lazy(() => import("../pages/auth/SigIn"));
const SignUpPage = lazy(() => import("../pages/auth/SignUp"));

// Helper function to wrap elements in Suspense
const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<RootLayoutPage />),
    errorElement: withSuspense(<ErrorPage />),
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
      },
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
            children: [
              {
                path: "assignment/:assignmentId",
                element: withSuspense(<AssignmentDetail />),
              },
              {
                path: "material/:materialId",
                element: withSuspense(<AssignmentDetail />),
              },
            ],
          },
        ],
      },
      {
        path: "todo",
        element: withSuspense(<ToDoPage />),
      },
      {
        path: "review",
        element: withSuspense(<ReviewPage />),
      },
      // {
      //   path: "calendar",
      //   element: withSuspense(<CalendarPage />),
      // },
      {
        path: "notification",
        element: withSuspense(<NotificationPage />),
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
  {
    path: "login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "signup",
    element: withSuspense(<SignUpPage />),
  },
]);

export default router;
