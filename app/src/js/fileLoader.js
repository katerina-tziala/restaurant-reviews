"use strict";
/**
** Class to load files.
**/
class FileLoader {
  // Get the position in which the CSS/Javascript file should be placed:
  static getFilePosition(fileType) {
    const positions = {
      link: "head",
      script: "body"
    };
    return positions[fileType];
  }

  // Get parameters of a file:
  static getFileParameters(filepath) {
    const fileType = filepath.split(".").pop();
    let params;
    if(fileType === "css") {
      params = {
        rel: "stylesheet",
        charset: "utf-8",
        href: filepath
      };
    } else {
      params = {
        type: "application/javascript",
        charset: "utf-8",
        src: filepath
      };
    }
    return params;
  }

  // Create tag and attributes of the CSS/Javascript file:
  static createFile(fileType, params) {
    const file = document.createElement(fileType);
    for (let i = 0; i < Object.keys(params).length; i++) {
      let attributename = Object.keys(params)[i];
      let attributevalue = params[attributename];
      file.setAttribute(attributename, attributevalue);
    }
    return file;
  }
  
  // Load file and return a promise:
  static loadFile(fileType, params) {
    return new Promise((resolve, reject) => {
      const file = this.createFile(fileType, params);
      if (file.readyState) { // IE
        file.onreadystatechange = () => {
          if (file.readyState == "loaded" || file.readyState == "complete"){
            file.onreadystatechange = null;
            resolve();
          } else {
            reject();
          }
        };
      } else { // Others
        file.onload = () => {
          resolve();
        };
      }
      file.onerror = () => {
        reject();
      };
      document[this.getFilePosition(fileType)].appendChild(file);
    });
  }

}