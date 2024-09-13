
function Input({id, label, type = "text", value, onChange, placeholder, required = false })  {
    return (
        <>
            <div className="input-field">
                <label htmlFor={id}>{label}</label>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
            </div>
        </>
    );
}

export default Input;
