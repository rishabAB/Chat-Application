 import "./customInput.scss";
const CustomInput = (props) =>
{
   
    const {type,regular,placeholder,onChange,obj,propName} =props;
    
    return(
        <input type={type} placeholder={placeholder} className="custom-input" onChange={(e) => onChange({...obj,[propName]:e.target.value})}/>
    )

}
export default CustomInput;