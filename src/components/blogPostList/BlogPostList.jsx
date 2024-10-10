import './BlogPostList.css';
import React from 'react';
import formatDate from '../../helpers/formatData.js';  // Import de formatDate helper

const BlogPostList = ({ posts }) => {
    return (
        <div>
            <h3>Blog Posts</h3>
            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="blog-post">
                        <h2>{post.title}</h2>
                        <p>{post.tekst}</p>
                        <small>{formatDate(post.date)}</small>
                    </div>
                ))
            )}
        </div>
    );
};

export default BlogPostList;

