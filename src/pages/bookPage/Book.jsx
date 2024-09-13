import './Book.css';
import {useState} from "react";
import api from "../../services/api.js";

function Book() {


    const [books, setBooks] = useState();
    const [book, setBook] = useState();

    const getBooks = async () => {
        try {
            const response = await api.get("/books")
            console.log(response.data);

            setBooks(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section>
                <div>

                </div>
            </section>
        </>
    );
}

export default Book;
