import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    isLoading,
    className = '',
    ...props
}) => {
    const baseClass = `btn btn-${variant} ${className}`;

    return (
        <button
            className={baseClass}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <div className="spinner"></div>}
            {!isLoading && children}
        </button>
    );
};

export default Button;
