import { useContext } from "react";
import { useParams } from "react-router-dom";

import PostComponent from "../components/Post";

import PostsContext from "../contexts/PostsContext";

export default function Post(): JSX.Element {
    const { posts } = useContext(PostsContext);
    const { id } = useParams();

    const post = posts.find((post) => post.id === Number(id));

    return post ? (
        <PostComponent key={post.id} {...post} showComments />
    ) : (
        <div>Post not found</div>
    );
}
