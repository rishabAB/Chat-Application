 import "./customInput.scss";
 import {useEffect,useState,useRef, createRef} from "react";
const CustomInput = (props) =>
{
   
    const {type,regular,placeholder,onChange,obj,propName,onEnter,onErrorObj} =props;
    const input_ref = useRef(null);

    useEffect(()=>
    {
        if(onErrorObj?.error)
        {
            input_ref.current.value="";
        }

    },[onErrorObj])
  
   
    return(
        <input type={type} ref={input_ref}  placeholder={placeholder}  className="custom-input"  onKeyDown = {(e) => e.key=="Enter" && onEnter ? onEnter(e) : null} onChange={(e) => onChange({...obj,[propName]:e.target.value})}/>
    )

}
export default CustomInput;