import './styles/Global.css';
import {Route, Routes } from 'react-router-dom';
import Navigation from "./components/navigation/Navigation.jsx";
import Home from "./pages/homePage/Home.jsx";
import Book from "./pages/bookPage/Book.jsx";
import Contact from "./pages/contactPage/Contact.jsx";
import Login from "./pages/loginPage/Login.jsx";
import Register from "./pages/registerPage/Register.jsx";

function App() {

    return (
        <>
            <Navigation />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/boeken" element={<Book />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </main>
        </>
    )
}

export default App
