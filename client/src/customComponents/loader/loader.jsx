import React, { useEffect, useState } from "react";
import "./loader.scss";
const Loader = (props)=>
{
  // Wrong Implementation
  // // let dots_arr=[];
  // const [dots_arr,setDots_arr] = useState(null);
  
  // useEffect(()=>
  // {
  //   let num=1;
  //   let elem=`<div className="dot d${num}"></div>`;
  //   for(let count=1;count<253;count++)
  //   {
  //     if(dots_arr?.length>0)
  //     {
  //       setDots_arr((prev) => [...prev,{val:elem}]);
  //       // console.log(dots_arr);

  //     }
  //     else{
  //       setDots_arr([{val:elem}]);
  //     }
  //     elem=`<div className="dot d${++num}"></div>`;
  //     console.log("For loop",dots_arr);
  //     // dots_arr.push({elem})
  //   }
  //   console.log(dots_arr);

  // },[])
  const {showLoader,responsizeFrame1} = props;

  const [dotsArr, setDotsArr] = useState([]);

  function loader()
  {
    return( <div className={responsizeFrame1 == false ? "holder holder-chatbox" : "holder"}>
      <div className="panel">
      {dotsArr.length > 0 && dotsArr.map((dot) => dot.val)}
      </div>
    </div>)
  }
  

  useEffect(() => {
    if(showLoader)
    {
      let dots = [];
      for (let num = 1; num <= 252; num++) {
        dots.push({ val: <div className={`dot d${num}`} key={num}></div> });
      }
      setDotsArr(dots);

    }
   
  }, [showLoader]);

  return( showLoader ? 
    loader() : "")

  // return( <div className="holder">
  //   <div className="panel">
  //   {dotsArr.length > 0 && dotsArr.map((dot) => dot.val)}
  //   </div>
  // </div>
  // )

}
export default Loader;