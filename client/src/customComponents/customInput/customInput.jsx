import "./customInput.scss";
import React, { useEffect,useRef } from "react";
import PropTypes from "prop-types";
const CustomInput = (props) => {
  const {
    type,
    placeholder,
    onChange,
    obj,
    propName,
    onEnter,
    onErrorObj,
    maxLength,
  } = props;
  const input_ref = useRef(null);

  useEffect(() => {
    if (onErrorObj?.error) {
      input_ref.current.value = "";
    }
  }, [onErrorObj]);

  return (
    <input
      type={type}
      ref={input_ref}
      maxLength={maxLength}
      placeholder={placeholder}
      className="custom-input"
      onKeyDown={(e) => (e.key == "Enter" && onEnter ? onEnter(e) : null)}
      onChange={(e) => onChange({ ...obj, [propName]: e.target.value })}
    />
  );
};
export default CustomInput;

CustomInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  obj: PropTypes.object,
  propName: PropTypes.string,
  onEnter: PropTypes.func,
  onErrorObj: PropTypes.object,
  maxLength: PropTypes.string,
};
