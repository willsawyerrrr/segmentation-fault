import { ArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";

import CurrentUserContext from "../contexts/CurrentUserContext";
import PostsContext from "../contexts/PostsContext";

import { createCommentVote, deleteComment, getPosts } from "../api";

interface CommentProps {
    id: number;
    created: Date;
    updated?: Date;
    author: number;
    content: string;
    votes: number;
    vote: boolean | null;
}

export default function Comment({
    id,
    created,
    updated,
    author,
    content,
    votes,
    vote,
}: CommentProps): JSX.Element {
    const { currentUser } = useContext(CurrentUserContext);
    const { setPosts } = useContext(PostsContext);

    async function voteAndUpdate(vote: boolean | null) {
        await createCommentVote(id, vote);
        setPosts(await getPosts());
    }

    async function del() {
        await deleteComment(id);
        setPosts(await getPosts());
    }

    return (
        <div className="grid grid-cols-8 gap-4">
            <div className="col-span-6 text-justify">{content}</div>
            <div className="col-span-1 mb-auto flex w-full flex-col items-center justify-center gap-2">
                <div
                    // src={getUserImage(author)}
                    // alt="Author"
                    className="m-auto aspect-square h-14 rounded-full bg-gray-400 object-cover"
                />
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
            <div className="col-span-1 mb-auto flex flex-col gap-6">
                <div className="grid grid-cols-2">
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
        </div>
    );
}
