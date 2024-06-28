import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";

export const routesConfig = [
    {
        path: "/",
        element: <LandingPage />,
        // errorElement: <ErrorPage />,
    },
];
export const router = createBrowserRouter(routesConfig);
