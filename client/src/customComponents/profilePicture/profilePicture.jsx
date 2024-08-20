import "./profilePicture.scss"
import { useState,useCallback, useEffect} from "react";
const ProfilePicture = (props) =>
{
    const {placeholder,onChange,obj,propName,onErrorObj} =props;
    const [fileName,setFileName] = useState(null);

    const getFileName = useCallback((event)=>
    {
        setFileName(event?.target?.files[0].name)
        onChange({...obj,[propName]:event?.target?.files[0]});

    },[obj])
    
    const styles = {
        color: fileName ? 'black' : 'rgb(12, 69, 125)',
    };

    useEffect(()=>
    {
        if(onErrorObj?.error)
        {
            setFileName(null);

        }

    },[onErrorObj])
   

    return (
        <>
         <input className=" select_profile_picture" id="input"
    accept=".jpg, .jpeg, .png"  type="file" 
    placeholder={placeholder} onChange={(e) => getFileName(e) }
    /> 
   <label  className="label_profile_picture" htmlFor="input" type="button" style={styles}> {fileName ? fileName : "Select Profile Picture"}</label>
    </>
   )

}
export default ProfilePicture;