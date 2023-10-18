import { get, httpDelete, post as httpPost, put } from ".";
import { externalisePostUpdate, internaliseComment, internalisePost } from "./conversions";
import { Comment, CommentExternal, Post, PostCreate, PostExternal, PostUpdate } from "./schemas";

const ROUTE_PREFIX = "/posts";

export async function getPosts(): Promise<Post[]> {
    const [status, posts] = await get<PostExternal[]>(`${ROUTE_PREFIX}/`);

    if (status === 200) {
        return await Promise.all(posts.map(internalisePost));
    } else {
        throw new Error("Unknown error");
    }
}

export async function createPost(post: PostCreate): Promise<Post> {
    const [status, createdPost] = await httpPost<PostExternal>(
        `${ROUTE_PREFIX}/`,
        JSON.stringify(post)
    );

    if (status === 201) {
        return internalisePost(createdPost);
    } else {
        throw new Error("Unknown error");
    }
}

export async function getPost(postId: number): Promise<Post> {
    const [status, post] = await get<PostExternal>(`${ROUTE_PREFIX}/${postId}`);

    if (status === 200) {
        return internalisePost(post);
    } else if (status === 404) {
        throw new Error(`Post '${postId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function updatePost(postId: number, post: PostUpdate): Promise<Post> {
    const [status, updatedPost] = await put<PostExternal>(
        `${ROUTE_PREFIX}/${postId}`,
        JSON.stringify(externalisePostUpdate(post))
    );

    if (status === 200) {
        return internalisePost(updatedPost);
    } else if (status === 404) {
        throw new Error(`Post '${postId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function deletePost(postId: number): Promise<void> {
    const [status, _] = await httpDelete<PostExternal>(`${ROUTE_PREFIX}/${postId}`);

    if (status === 404) {
        throw new Error(`Post '${postId}' not found`);
    } else if (status !== 200) {
        throw new Error("Unknown error");
    }
}

export async function getPostComments(postId: number): Promise<Comment[]> {
    const [status, children] = await get<CommentExternal[]>(`${ROUTE_PREFIX}/${postId}/comments`);

    if (status === 200) {
        return await Promise.all(children.map(internaliseComment));
    } else if (status === 404) {
        throw new Error(`Post '${postId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function getPostVotes(postId: number): Promise<number> {
    const [status, votes] = await get<number>(`${ROUTE_PREFIX}/${postId}/votes`);

    if (status === 200) {
        return votes;
    } else if (status === 404) {
        throw new Error(`Post '${postId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function getPostVote(postId: number): Promise<boolean | null> {
    const [status, vote] = await get<string>(`${ROUTE_PREFIX}/${postId}/vote`);

    if (status === 200) {
        return JSON.parse(vote);
    } else if (status === 404) {
        throw new Error(`Post '${postId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function createPostVote(postId: number, up: boolean | null): Promise<void> {
    const [status, _] = await httpPost(`${ROUTE_PREFIX}/${postId}/vote?type=${up}`);

    if (status === 404) {
        throw new Error(`Post '${postId}' not found`);
    } else if (status !== 201) {
        throw new Error("Unknown error");
    }
}
