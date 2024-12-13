import React, {useState, useEffect, useContext} from 'react';
import BlogPostForm from '../blogPostForm/BlogPostForm.jsx';
import BlogPostList from '../../components/blogPostList/BlogPostList.jsx';
import './Blog.css';
import {AuthContext} from "../../context/AuthContext.jsx";

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const { loggedIn, user } = useContext(AuthContext);

    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem('blogPosts'));
        if (savedPosts) {
            setPosts(savedPosts);
        }
    }, []);


    const addPost = (newPost) => {
        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);

        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    };

    return (
        <>
            <main className="post-detail-section">
                <section className="new-blog-content-container"></section>
                <h1>Vers van de pers</h1>
                {(loggedIn) && <>
                    {user.role === "ADMIN" && <>
                        <BlogPostForm onAddPost={addPost}/> </>}
                </>}
                <BlogPostList posts={posts}/>
            </main>
        </>
    );
};

export default Blog;
