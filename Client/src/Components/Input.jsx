import React from "react";

function Input({
  name,
  label,
  type,
  placeholder,
  className,
  prop,
  element = null,
  required,
  ...rest
}) {
  return (
    <div className={`flex flex-col items-end space-y-2 ${prop||""}`}>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={className}
        {...rest}
      />
      {element && element}
    </div>
  );
}

export default Input;
