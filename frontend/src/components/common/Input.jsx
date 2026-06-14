import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    id,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`form-group ${className}`}>
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <input
                id={id}
                ref={ref}
                className="form-input"
                {...props}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
