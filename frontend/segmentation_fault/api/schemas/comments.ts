export interface Comment {
    id: number;
    created: Date;
    updated?: Date;
    author: number;
    content: string;
    post: number;
    votes: number;
    vote: boolean | null;
}

export interface CommentCreate {
    content: string;
    post: number;
}

export interface CommentExternal {
    id: number;
    created: string;
    updated?: string;
    author: number;
    content: string;
    post: number;
}

export interface CommentCreateExternal {
    content: string;
    post: number;
}

export interface CommentUpdate {
    content: string;
}

export interface CommentUpdateExternal {
    content: string;
}
