import React from "react";

function InputElement({name, label, id, cols, rows, value, onChange}) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <textarea
                name={name}
                id={id}
                cols={cols}
                rows={rows}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default InputElement;
