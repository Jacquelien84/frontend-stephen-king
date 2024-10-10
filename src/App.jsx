import './App.css';

import {Navigate, Route, Routes} from 'react-router-dom';
import React, {useContext} from "react";
import {AuthContext} from "./context/AuthContext";

import Navigation from "./components/navigation/Navigation.jsx";
import Footer from "./components/footer/Footer.jsx";

import Home from "./pages/homePage/Home.jsx";
import Books from "./pages/bookPage/Books.jsx";
import Blog from "./pages/blogPage/Blog.jsx";
import Login from "./pages/loginPage/Login.jsx";
import Register from "./pages/registerPage/Register.jsx";
import Profile from "./pages/profilePage/Profile.jsx";
import BookDetails from "./pages/bookDetails/BookDetails.jsx";
import UploadNewBook from "./pages/uploadPage/UploadNewBook.jsx";
import BlogPostForm from "./pages/blogPostForm/BlogPostForm.jsx";

function App() {
    const { loggedIn } = useContext(AuthContext);

    return (
        <>
            <Navigation />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/book" element={<Books />} />
                    <Route path="/news" element={<Blog />} />
                    <Route path="/profile" element={loggedIn === true ? <Profile/> : <Navigate to="/login"/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/books/:id" element={<BookDetails />}/>
                    <Route path="/blog" element={<Blog />}/>
                    <Route path="/uploadnewbook" element={<UploadNewBook/>}/>
                    <Route path="/blogpostform" element={<BlogPostForm />}/>
                </Routes>

            <Footer/>
        </>
    );
}

export default App
