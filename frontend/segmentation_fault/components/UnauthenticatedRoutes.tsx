import { useContext } from "react";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext";

/**
 * Route which requires the user to be unauthenticated.
 * If the user is authenticated, they will be redirected to the home page.
 *
 * @returns unauthenticated route component
 */
export default function UnauthenticatedRoutes(): JSX.Element {
    const { currentUser } = useContext(CurrentUserContext);

    return currentUser ? <Navigate to="/home" replace /> : <Outlet />;
}
