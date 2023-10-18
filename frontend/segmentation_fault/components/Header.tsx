import { useContext } from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext";

import { getUserImage } from "../api";

interface HeaderProps {}

export default function Header({}: HeaderProps): JSX.Element {
    const { currentUser } = useContext(CurrentUserContext);

    return (
        <header className="flex flex-row items-center justify-center bg-gray-800 p-4">
            <div className="bg-grey flex h-full w-full max-w-7xl flex-row items-center justify-between gap-4 text-white">
                <Link to="/home">
                    <h1>Segmentation Fault</h1>
                </Link>
                {currentUser && (
                    <Link to="/profile">
                        <img
                            className="aspect-square w-12 rounded-full bg-gray-400"
                            src={getUserImage(currentUser.id)}
                        />
                    </Link>
                )}
            </div>
        </header>
    );
}
