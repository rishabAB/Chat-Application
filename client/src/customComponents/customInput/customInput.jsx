 import "./customInput.scss";
 import React,{useEffect,useState,useRef} from "react";
const CustomInput = (props) =>
{
   
    const {type,regular,placeholder,onChange,obj,propName,onEnter,onErrorObj,maxLength} =props;
    const input_ref = useRef(null);

    useEffect(()=>
    {
        if(onErrorObj?.error)
        {
            input_ref.current.value="";
        }

    },[onErrorObj])
  
   
    return(
        <input type={type} ref={input_ref} maxLength={maxLength} placeholder={placeholder}  className="custom-input"  onKeyDown = {(e) => e.key=="Enter" && onEnter ? onEnter(e) : null} onChange={(e) => onChange({...obj,[propName]:e.target.value})}/>
    )

}
export default CustomInput;