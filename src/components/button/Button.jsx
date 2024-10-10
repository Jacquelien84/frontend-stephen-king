import './Button.css';

function Button({disabled, size, text, onClick, type, value, icon}) {
    return (<>
        <button className={size} disabled={disabled} onClick={onClick} value={value} type={type}> {(icon != null) &&
            <div className="button-icon">{icon}</div>} <p>{text}</p></button>
    </>)
}

export default Button;
