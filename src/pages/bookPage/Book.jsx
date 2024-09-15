import './Book.css';
import {useEffect, useState} from "react";
import axios from "axios";

function GetRequestPage() {
    const [books, setBooks] = useState([]);
    const [imageData, setImageData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        void fetchBooks()
    }, []);

    async function fetchData(id, path) {
        setError(null);

        try {
            setLoading(true);
            const download = await axios.get(`http://localhost:8080/books/${id}/${path}`, {
                responseType: 'arraybuffer'
            });
            const blob = new Blob([download.data], {type: 'image/png'});
            const dataUrl = URL.createObjectURL(blob);
            setImageData(dataUrl);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchBooks() {
        try {
            const response = await axios.get('http://localhost:8080/books');
            // Plaats alle studenten in de state zodat we het op de pagina kunnen gebruiken
            setBooks(response.data);
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    async function deleteBook(id) {
        try {
            await axios.delete(`http://localhost:8080/books/${id}`)
            window.alert('Book successfully deleted!');
            // haal de studenten nu opnieuw op, zodat de gebruiker ziet dat de entry verwijderd is
            // deze is overbodig, hij wordt bovenaan aangeroepen(zie demo)
            void fetchBooks();
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="page-container">
            <h1>Alle boeken van Stephen King</h1>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Foto</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Originele title</th>
                    <th>Released</th>
                    <th>Verfilmd</th>
                    <th>Beschrijving</th>
                </tr>
                </thead>
                <tbody>
                {books.map((book) => {
                    // De key moet op het buitenste element staan en uniek zijn
                    return <tr key={book.id}>
                        <td>{book.id}</td>
                        {/*Even checken of er uberhaupt een file is, en zo ja, dan laten we hem zien!*/}
                        <td>{book.studentPhoto && <img src={`http://localhost:8080/books/${book.id}/photo`}
                                                       alt={book.name}
                                                       onClick={() => fetchData(book.id, 'photo')}/>
                        }
                        </td>
                        <td><strong>{book.title[0].toUpperCase() + book.title.slice(1)}</strong></td>
                        <td>{book.author}</td>
                        <td>{book.originalTitle}</td>
                        <td>{book.released}</td>
                        <td>{book.movieAdaptation}</td>
                        <td>{book.description}</td>

                    </tr>
                })}
                </tbody>
            </table>
            <div className="download-container">
                {loading ? <p>Loading...</p> : imageData &&
                    <img className='image-container' src={imageData} alt="blob"/>}
                {error && <p className="error-message">Something went wrong!</p>}
            </div>
        </div>
    );
}

export default GetRequestPage;




            {/*<section className="book-detail-section outer-content-container">*/}
            {/*    <div className="inner-content-container">*/}
            {/*        <Button type="button" onClick={fetchBooks} variant="primary">Haal de beschrijving van het boek op.</Button>*/}
            {/*        {Object.keys(book).length > 0 && (<>*/}
            {/*        <h1>{book.id}</h1>*/}
            {/*        <h2>{book.title}</h2>*/}
            {/*        <p className="book-detail-author">Geschreven door<em>{book.author}</em> op {formatDataString(book.reviews)}</p>*/}
            {/*        <span className="post-detail-read-time">*/}
            {/*            <Clock color="#50535C" size={18}/>*/}
            {/*            <p> {book.readTime} minuten lezen</p>*/}
            {/*        </span>*/}
            {/*        <p>{book.description}</p>*/}
            {/*        <p>{book.comment} reacties - {book.likes} keer geliked</p>*/}
            {/*        </>)}*/}
            {/*        {error && <p>Er is iets misgegaan bij het ophalen van de data. Probeer jet opnieuw.</p>}*/}
            {/*        <Link to="/books" className="back-link">*/}
            {/*            <CaretLeft color="#38E991" size={22}/>*/}
            {/*            <p>Terug naar de overzichtspagina</p>*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*</section>*/}

