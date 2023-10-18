import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { User } from "./api/schemas";

import AuthenticatedRoutes from "./components/AuthenticatedRoutes";
import Header from "./components/Header";
import UnauthenticatedRoutes from "./components/UnauthenticatedRoutes";

import CurrentUserContext from "./contexts/CurrentUserContext";
import PostsContext from "./contexts/PostsContext";

import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import SignUp from "./pages/SignUp";
import Verify from "./pages/Verify";

import "./App.css";
import { getCurrentUser, Post as PostSchema, getPosts } from "./api";

export default function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostSchema[]>([]);

    useEffect(() => {
        (async () => setCurrentUser((await getCurrentUser()) as User))();
    }, []);

    useEffect(() => {
        (async () => setPosts(await getPosts()))();
    }, []);

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            <PostsContext.Provider value={{ posts, setPosts }}>
                <BrowserRouter>
                    <Header />
                    <main className="mx-auto my-36 flex w-full flex-col items-center justify-center sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                        <Routes>
                            <Route element={<AuthenticatedRoutes />}>
                                <Route path="/home" element={<Home />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/post/:id" element={<Post />} />
                            </Route>

                            <Route element={<UnauthenticatedRoutes />}>
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/sign-up" element={<SignUp />} />
                                <Route path="/verify-email" element={<Verify />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Routes>
                    </main>
                </BrowserRouter>
            </PostsContext.Provider>
        </CurrentUserContext.Provider>
    );
}
