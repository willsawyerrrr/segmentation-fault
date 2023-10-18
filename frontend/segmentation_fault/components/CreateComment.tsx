import { useContext, useState } from "react";

import PostsContext from "../contexts/PostsContext";

import { CommentCreate, createComment, getPosts } from "../api";

interface CreateCommentProps {
    /** The ID of the post. */
    post: number;
}

export default function CreateComment({ post }: CreateCommentProps): JSX.Element {
    const { setPosts } = useContext(PostsContext);

    const [comment, setComment] = useState<CommentCreate>({ content: "", post });

    async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const createdComment = await createComment(comment);
        setComment({ content: "", post });
        setPosts(await getPosts());
    }

    return (
        <form className="flex w-full flex-col gap-4 lg:flex-row" onSubmit={handleCreate}>
            <textarea
                className="w-full basis-full lg:basis-4/5"
                id="content"
                name="content"
                onChange={(e) => setComment((comment) => ({ ...comment, content: e.target.value }))}
                placeholder="Write your comment here"
                required
                value={comment.content}
            />
            <button className="ml-auto w-full basis-1/2 lg:basis-1/5" type="submit">
                Create
            </button>
        </form>
    );
}
