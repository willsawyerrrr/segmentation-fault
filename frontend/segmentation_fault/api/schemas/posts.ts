export interface Post {
    id: number;
    created: Date;
    updated?: Date;
    author: number;
    title: string;
    content: string;
    votes: number;
    vote: boolean | null;
}

export interface PostCreate {
    title: string;
    content: string;
}

export interface PostCreateExternal {
    title: string;
    content: string;
}

export interface PostExternal {
    id: number;
    created: string;
    updated?: string;
    author: number;
    title: string;
    content: string;
}

export interface PostUpdate {
    title: string;
    content: string;
}

export interface PostUpdateExternal {
    title: string;
    content: string;
}
