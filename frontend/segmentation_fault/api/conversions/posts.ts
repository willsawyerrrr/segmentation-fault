import { internaliseDate } from ".";
import { getCurrentUser } from "../auth";
import { getPostVote, getPostVotes } from "../posts";
import {
    Post,
    PostCreate,
    PostCreateExternal,
    PostExternal,
    PostUpdate,
    PostUpdateExternal,
} from "../schemas";

export async function internalisePost(post: PostExternal): Promise<Post> {
    return {
        id: post.id,
        created: new Date(post.created),
        updated: internaliseDate(post.updated),
        author: post.author,
        title: post.title,
        content: post.content,
        votes: await getPostVotes(post.id),
        vote: await getPostVote(post.id),
    };
}

export function externalisePostCreate(postCreate: PostCreate): PostCreateExternal {
    return {
        title: postCreate.title,
        content: postCreate.content,
    };
}

export function externalisePostUpdate(postUpdate: PostUpdate): PostUpdateExternal {
    return {
        title: postUpdate.title,
        content: postUpdate.content,
    };
}
