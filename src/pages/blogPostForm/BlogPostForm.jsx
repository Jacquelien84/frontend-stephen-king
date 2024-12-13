import './BlogPostForm.css'
import React, {useState} from 'react';
import Button from "../../components/button/Button.jsx";

const BlogPostForm = ({ onAddPost }) => {
    const [title, setTitle] = useState('');
    const [tekst, setTekst] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            id: Date.now(),
            title: title,
            tekst: tekst,
            date: new Date().toLocaleString(),
        };

        onAddPost(newPost);
        setTitle('');
        setTekst('');
    };

    return (
        <>
            <main className="form-content">
                <section className="form-container-column">
                    <form onSubmit={handleSubmit}>

                            <label htmlFor="title"></label>
                            Title:
                            <textarea
                                name="title-field"
                                id="title"
                                cols="30"
                                rows="1"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}>
                                </textarea>


                            <label>Tekst:</label>
                            <textarea
                                name="tekst-field"
                                id="tekst"
                                cols="30"
                                rows="10"
                                value={tekst}
                                onChange={(e) => setTekst(e.target.value)}>
                                </textarea>

                        <Button
                            size="small"
                            text={"Plaats blog"}
                            type="submit"
                        />
                    </form>
                </section>
            </main>
        </>
    );
}

export default BlogPostForm;
