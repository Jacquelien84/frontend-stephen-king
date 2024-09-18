import styles from './SearchBar.css';
import {useState} from "react";

export default function SearchBar() {
    const [selectedOption, setSelectedOption] = useState('book1');
    const handleChange = event => {
        setSelectedOption(event.target.value);
    };

    return (
        <select className={styles.searchDropdown} id="searchBar" onChange={handleChange}>
            <option className={styles.option} value="book1">Bezeten Stad</option>
            <option className={styles.option} value="book2">Carrie</option>
            <option className={styles.option} value="book3">De Beproeving</option>
            <option className={styles.option} value="book4">De shining</option>
            <option className={styles.option} value="book5">Dodelijk dilemma</option>
            <option className={styles.option} value="book6">Ogen van vuur</option>
            <option className={styles.option} value="book7">Satanskinderen</option>
        </select>
    );
}
