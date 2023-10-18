import { useContext, useState } from "react";

import PostsContext from "../contexts/PostsContext";

import { PostCreate, createPost } from "../api";

interface CreatePostProps {
    /** Function to stop creating a new post post. */
    cancel: () => void;
}

export default function CreatePost({ cancel }: CreatePostProps): JSX.Element {
    const { setPosts } = useContext(PostsContext);

    const [post, setPost] = useState<PostCreate>({ content: "", title: "" });

    async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const createdPost = await createPost(post);
        setPosts((posts) => [...posts, createdPost]);
        setPost({ content: "", title: "" });
        cancel();
    }

    return (
        <form className="flex w-full flex-col gap-4" onSubmit={handleCreate}>
            <input
                className="w-full"
                id="title"
                name="title"
                onChange={(e) => setPost((post) => ({ ...post, title: e.target.value }))}
                placeholder="Enter your title here"
                required
                type="text"
                value={post.title}
            />
            <textarea
                className="w-full"
                id="content"
                name="content"
                onChange={(e) => setPost((post) => ({ ...post, content: e.target.value }))}
                placeholder="Enter your post here"
                required
                value={post.content}
            />
            <div className="flex flex-row justify-between gap-8">
                <button onClick={cancel} type="button">
                    Cancel
                </button>
                <button type="submit">Create</button>
            </div>
        </form>
    );
}
