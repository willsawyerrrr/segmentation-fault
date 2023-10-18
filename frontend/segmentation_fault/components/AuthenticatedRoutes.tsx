import { useContext } from "react";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext";

/**
 * Routes which requires the user to be authenticated.
 * If the user is unauthenticated, they will be redirected to the login page.
 *
 * @returns authenticated route component
 */
export default function AuthenticatedRoutes(): JSX.Element {
    const { currentUser } = useContext(CurrentUserContext);

    return currentUser ? <Outlet /> : <Navigate to="login" replace />;
}
