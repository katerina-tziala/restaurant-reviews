class FileLoader {
  /**
  ** Get the position in which the CSS/Javascript file should be placed.
  **/
  static getFilePosition(fileType) {
    const positions = {
      "link": "head",
      "script": "body"
    };
    return positions[fileType];
  }
  /**
  ** Create tag and attributes of the CSS/Javascript file.
  **/
  static createFile(fileType, params) {
    const file = document.createElement(fileType);
    for (let i = 0; i < Object.keys(params).length; i++) {
      let attributename = Object.keys(params)[i];
      let attributevalue = params[attributename];
      file.setAttribute(attributename, attributevalue);
    }
    return file;
  }
  /**
  ** Load CSS/Javascript file.
  **/
  static loadFile(fileType, params, callback) {
    //try catch error
    const file = this.createFile(fileType, params);
    if (file.readyState) {  //IE
      file.onreadystatechange = () => {
        if (file.readyState == "loaded" || file.readyState == "complete"){
          file.onreadystatechange = null;
          callback();
        }
      };
    } else {//Others
      file.onload = () => {
        callback();
      };
    }
    document[this.getFilePosition(fileType)].appendChild(file);
  }
}
