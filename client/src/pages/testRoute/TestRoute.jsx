/* eslint-disable no-unused-vars */

import React from "react";
const TestRoute = () => {

  let skipIndex = 0;

  function createNestedStructure(nestedFiles, folderStructure, index, parentName) {
    let tempSkipIndex = skipIndex;
   
    for (let file of nestedFiles) {
      if (tempSkipIndex > 0) {
        tempSkipIndex--;
        continue;
      }
  
      const relativePath = file?.webkitRelativePath?.split("/") || file?.file?.webkitRelativePath.split("/");
      const recursiveParentName = relativePath[index];
  
      // Case where parent has changed so return the folder structure 
      if (relativePath.length - index <= 1 && recursiveParentName !== parentName) {
        return folderStructure;
      }
  
      // Case where there is no subfolder so add the file 
      if (relativePath.length - index < 3 && recursiveParentName === parentName) {
      
        folderStructure.push({
          file: file,
          parentFolder: recursiveParentName,
        });
        skipIndex++;
      } else if (recursiveParentName === parentName) {
        // Case where a folder has further subfolders, so call recursion
        ++index;
        const res = createNestedStructure(nestedFiles, [], index, relativePath[index]);
       
        let resLength = res?.length;
      // Insert the files
          for(let tempIndex= 0;tempIndex<resLength;tempIndex++)
          {
            folderStructure.push({file:res[tempIndex],parentFolder:recursiveParentName});
          }
       
        if(skipIndex  == nestedFiles.length)
        return folderStructure;
        --index;
      } else {
       // Case where parent has changed so return the current folder structure and the recursion response 
        return [folderStructure,createNestedStructure(nestedFiles, [], index, recursiveParentName)];
        
      }
    }
  
     return folderStructure;
  }

  const uploadData = async (event) => {
  
      skipIndex =0;
      console.log("case Folder", event.target.files);
      let folderStructure = [];
     
      if (event.target.files.length > 0) {
        const res = createNestedStructure(
          event.target.files,
          folderStructure,
          0,
          event.target.files[0].webkitRelativePath.split("/")[0],
        );
        console.log("res",res);
        document.getElementById("folder").value = "";
        
      }

    
  };
  return (
    <>
      <input
            className="custom-input"
            type="file"
            webkitdirectory="true"
            id="folder"
            multiple
            onChange={($event) => uploadData($event)}
          />

    </>
  );
};
export default TestRoute;
