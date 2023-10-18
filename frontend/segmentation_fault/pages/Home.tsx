import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";

import CreatePost from "../components/CreatePost";
import Post from "../components/Post";

import PostsContext from "../contexts/PostsContext";

import useDocumentTitle from "../utils/useDocumentTitle";

interface HomeProps {}

export default function Home({}: HomeProps): JSX.Element {
    useDocumentTitle("Home");

    const { posts } = useContext(PostsContext);

    const [creating, setCreating] = useState(false);
    const [search, setSearch] = useState("");

    return (
        <div className="flex w-full flex-col gap-8">
            <input
                id="search"
                name="search"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                placeholder="Search Posts"
                type="text"
                value={search}
            />
            {creating ? (
                <CreatePost cancel={() => setCreating(false)} />
            ) : (
                <div
                    className="flex cursor-pointer flex-row justify-end gap-6"
                    onClick={() => setCreating(true)}
                >
                    <p className="text-2xl">Create New Post</p>
                    <PencilSquareIcon className="h-8 stroke-gray-400 stroke-2" />
                </div>
            )}
            {posts
                .filter(
                    (post) =>
                        !search ||
                        search.split(" ").every((piece) => post.title.toLowerCase().includes(piece))
                )
                .map((post) => (
                    <Post key={post.id} {...post} />
                ))}
        </div>
    );
}
