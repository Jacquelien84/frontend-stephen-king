import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';
import AuthContextProvider from "./context/AuthContext.jsx";
import App from './App.jsx'
import './index.css';
import BookContextProvider from "./context/BookContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <AuthContextProvider>
                <BookContextProvider>
                        <ErrorBoundary>
                            <App/>
                        </ErrorBoundary>
                </BookContextProvider>
            </AuthContextProvider>
        </Router>
    </React.StrictMode>,
)
