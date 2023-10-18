import { internaliseDate } from ".";
import { getCommentVotes, getCommentVote } from "../comments";
import {
    Comment,
    CommentExternal,
    CommentCreate,
    CommentCreateExternal,
    CommentUpdate,
    CommentUpdateExternal,
} from "../schemas";

export async function internaliseComment(comment: CommentExternal): Promise<Comment> {
    return {
        id: comment.id,
        created: new Date(comment.created) as Date,
        updated: internaliseDate(comment.updated),
        author: comment.author,
        content: comment.content,
        post: comment.post,
        votes: await getCommentVotes(comment.id),
        vote: await getCommentVote(comment.id),
    };
}

export function externaliseCommentCreate(commentCreate: CommentCreate): CommentCreateExternal {
    return {
        content: commentCreate.content,
        post: commentCreate.post,
    };
}

export function externaliseCommentUpdate(commentUpdate: CommentUpdate): CommentUpdateExternal {
    return {
        content: commentUpdate.content,
    };
}
