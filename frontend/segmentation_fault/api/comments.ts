import { get, httpDelete, post, put } from ".";
import {
    externaliseCommentCreate,
    externaliseCommentUpdate,
    internaliseComment,
} from "./conversions";
import { Comment, CommentCreate, CommentExternal, CommentUpdate } from "./schemas";

const ROUTE_PREFIX = "/comments";

export async function getComments(): Promise<Comment[]> {
    const [status, retrievedComments] = await get<CommentExternal[]>(`${ROUTE_PREFIX}/`);

    if (status === 200) {
        return await Promise.all(retrievedComments.map(internaliseComment));
    } else {
        throw new Error("Unknown error");
    }
}

export async function createComment(comment: CommentCreate): Promise<Comment> {
    const [status, createdComment] = await post<CommentExternal>(
        `${ROUTE_PREFIX}/`,
        JSON.stringify(externaliseCommentCreate(comment))
    );

    if (status === 201) {
        return await internaliseComment(createdComment);
    } else {
        throw new Error("Unknown error");
    }
}

export async function getComment(commentId: number): Promise<Comment> {
    const [status, retrievedComment] = await get<CommentExternal>(`${ROUTE_PREFIX}/${commentId}`);

    if (status === 200) {
        return await internaliseComment(retrievedComment);
    } else if (status === 404) {
        throw new Error(`Comment '${commentId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function updateComment(commentId: number, comment: CommentUpdate): Promise<Comment> {
    const [status, updatedComment] = await put<CommentExternal>(
        `${ROUTE_PREFIX}/${commentId}`,
        JSON.stringify(externaliseCommentUpdate(comment))
    );

    if (status === 200) {
        return await internaliseComment(updatedComment);
    } else if (status === 404) {
        throw new Error(`Comment '${commentId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function deleteComment(commentId: number): Promise<void> {
    const [status, _] = await httpDelete(`${ROUTE_PREFIX}/${commentId}`);

    if (status === 404) {
        throw new Error(`Comment '${commentId}' not found`);
    } else if (status !== 200) {
        throw new Error("Unknown error");
    }
}

export async function getCommentVotes(commentId: number): Promise<number> {
    const [status, votes] = await get<number>(`${ROUTE_PREFIX}/${commentId}/votes`);

    if (status === 200) {
        return votes;
    } else if (status === 404) {
        throw new Error(`Comment '${commentId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function getCommentVote(commentId: number): Promise<boolean | null> {
    const [status, vote] = await get<string>(`${ROUTE_PREFIX}/${commentId}/vote`);

    if (status === 200) {
        return JSON.parse(vote);
    } else if (status === 404) {
        throw new Error(`Comment '${commentId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function createCommentVote(commentId: number, up: boolean | null): Promise<void> {
    const [status, _] = await post(`${ROUTE_PREFIX}/${commentId}/vote?type=${up}`);

    if (status === 404) {
        throw new Error(`Comment '${commentId}' not found`);
    } else if (status !== 201) {
        throw new Error("Unknown error");
    }
}
