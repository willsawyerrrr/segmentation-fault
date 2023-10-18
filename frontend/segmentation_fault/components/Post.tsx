import { ArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext";
import PostsContext from "../contexts/PostsContext";

import {
    Comment as CommentSchema,
    createPostVote,
    deletePost,
    getPostComments,
    getPosts,
} from "../api";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

interface PostProps {
    id: number;
    created: Date;
    showComments?: boolean;
    updated?: Date;
    author: number;
    title: string;
    content: string;
    votes: number;
    vote: boolean | null;
}

export default function Post({
    id,
    created,
    showComments = false,
    updated,
    author,
    title,
    content,
    votes,
    vote,
}: PostProps): JSX.Element {
    const { setPosts } = useContext(PostsContext);
    const { currentUser } = useContext(CurrentUserContext);

    const [comments, setComments] = useState<CommentSchema[]>([]);

    useEffect(() => {
        if (showComments) {
            (async () => setComments(await getPostComments(id)))();
        }
    }, [id, showComments]);

    async function voteAndUpdate(vote: boolean | null) {
        await createPostVote(id, vote);
        setPosts(await getPosts());
    }

    async function del() {
        await deletePost(id);
        setPosts(await getPosts());
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-8 gap-4">
                <div
                    // src={getUserImage(author)}
                    // alt="Author"
                    className="m-auto aspect-square h-14 rounded-full bg-gray-400 object-cover"
                />
                <div className="col-span-7">
                    <div className="flex w-full flex-col gap-2">
                        {showComments ? (
                            <h2>{title}</h2>
                        ) : (
                            <Link to={`/post/${id}`}>
                                <h2 className="hover:text-blue-600">{title}</h2>
                            </Link>
                        )}
                        <p className="text-right">
                            {updated?.toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "medium",
                            }) ??
                                created.toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "medium",
                                })}
                        </p>
                    </div>
                </div>
                <div className="col-span-1 mb-auto grid grid-cols-1 gap-6">
                    <div className="flex flex-row items-center justify-center gap-5">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <ArrowUpIcon
                                className={`h-6 cursor-pointer stroke-[4px] ${
                                    vote === true ? "stroke-orange-500" : "stroke-gray-400"
                                }`}
                                onClick={() => voteAndUpdate(vote === true ? null : true)}
                            />
                            <ArrowUpIcon
                                className={`h-6 -scale-y-100 cursor-pointer stroke-[4px] ${
                                    vote === false ? "stroke-blue-800" : "stroke-gray-400"
                                }`}
                                onClick={() => voteAndUpdate(vote === false ? null : false)}
                            />
                        </div>
                        <p className="self-center text-center text-xl text-gray-400">{votes}</p>
                    </div>
                    {currentUser?.id === author && (
                        <div className="flex items-center justify-center">
                            <TrashIcon
                                className="h-6 cursor-pointer stroke-gray-400 stroke-2"
                                onClick={del}
                            />
                        </div>
                    )}
                </div>
                <div className="col-span-7 text-justify">{content}</div>
            </div>
            {showComments && (
                <>
                    <hr className="col-span-6 rounded-sm bg-gray-400" />
                    <CreateComment post={id} />
                    <hr className="col-span-6 rounded-sm bg-gray-400" />
                    {comments.map((comment) => (
                        <Comment {...comment} />
                    ))}
                </>
            )}
        </div>
    );
}
