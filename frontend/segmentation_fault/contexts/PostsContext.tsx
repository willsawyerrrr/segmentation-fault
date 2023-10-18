import { createContext } from "react";

import { Post } from "../api/schemas";

interface PostsContextProps {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostsContext = createContext<PostsContextProps>({ posts: [], setPosts: () => {} });

PostsContext.displayName = "PostsContext";

export default PostsContext;
