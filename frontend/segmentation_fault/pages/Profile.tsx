import { InboxArrowDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";

import { User } from "../api/schemas";

import CurrentUserContext from "../contexts/CurrentUserContext";

import useDocumentTitle from "../utils/useDocumentTitle";

import { getUserImage, updateUser, uploadUserImage } from "../api";

interface ProfileProps {}

export default function Profile({}: ProfileProps): JSX.Element {
    useDocumentTitle("Profile");

    const { currentUser } = useContext(CurrentUserContext);

    const [user, setUser] = useState<User>(currentUser as User);
    const [editing, setEditing] = useState<boolean>(false);

    const [image, setImage] = useState<string>("");
    const [imageEdited, setImageEdited] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(user === null);

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser as User);
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => setImage(getUserImage(user.id)), []);

    async function handleUpdateProfile() {
        await updateUser(user.id, {
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        });

        if (imageEdited) {
            await uploadUserImage(user.id, image);
        }

        setEditing(false);
    }

    async function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        sessionStorage.removeItem("token");
        window.location.href = "/";
    }

    return loading ? (
        <div>Loading...</div>
    ) : (
        <div className="flex w-full flex-col justify-between gap-6">
            <div className="flex w-full flex-row items-center justify-between">
                <h2>Profile</h2>
                {editing ? (
                    <InboxArrowDownIcon
                        className="h-6 w-6 stroke-white"
                        onClick={() => handleUpdateProfile()}
                    />
                ) : (
                    <PencilIcon className="h-6 w-6 stroke-white" onClick={() => setEditing(true)} />
                )}
            </div>

            {editing ? (
                <>
                    <label htmlFor="first-name">First Name</label>
                    <input
                        autoComplete="given-name"
                        id="first-name"
                        onChange={(e) =>
                            setUser((user) => ({ ...user, firstName: e.target.value }))
                        }
                        required
                        type="text"
                        value={user.firstName}
                    />

                    <label htmlFor="last-name">Last Name</label>
                    <input
                        autoComplete="family-name"
                        id="last-name"
                        onChange={(e) => setUser((user) => ({ ...user, lastName: e.target.value }))}
                        required
                        type="text"
                        value={user.lastName}
                    />

                    <label htmlFor="username">Username</label>
                    <input
                        autoComplete="username"
                        id="username"
                        onChange={(e) => setUser((user) => ({ ...user, username: e.target.value }))}
                        required
                        type="text"
                        value={user.username}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        autoComplete="email"
                        id="email"
                        onChange={(e) => setUser((user) => ({ ...user, email: e.target.value }))}
                        required
                        type="text"
                        value={user.email}
                    />

                    <label htmlFor="image">Profile Image</label>
                    <input
                        accept="image/*"
                        id="image"
                        name="image"
                        onChange={(e) => {
                            const files = e.target.files as FileList;
                            if (files.length === 0) {
                                setImage("");
                            }
                            setImage(URL.createObjectURL(files[0]));
                            setImageEdited(true);
                        }}
                        required
                        placeholder="Choose an image"
                        type="file"
                    />

                    <img
                        src={image}
                        alt="Profile Image"
                        className="mt-2 aspect-square h-32 self-center rounded-full object-cover"
                    />
                </>
            ) : (
                <>
                    <div className="flex flex-row justify-between">
                        <h4>
                            <strong>First Name:</strong>
                        </h4>
                        {user.firstName}
                    </div>

                    <div className="flex flex-row justify-between">
                        <h4>
                            <strong>Last Name:</strong>
                        </h4>
                        {user.lastName}
                    </div>

                    <div className="flex flex-row justify-between">
                        <h4>
                            <strong>Username:</strong>
                        </h4>
                        {user.username}
                    </div>
                    <div className="flex flex-row justify-between">
                        <h4>
                            <strong>Email:</strong>
                        </h4>
                        {user.email}
                    </div>
                </>
            )}

            <button
                className="bg-slate-900 px-4 py-2 text-white"
                id="sign-up"
                onClick={handleLogout}
                type="button"
            >
                Logout
            </button>
        </div>
    );
}
