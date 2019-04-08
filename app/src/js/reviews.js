"use strict";
let focusAfterError=[];
let reviewInitiator="";
let reviewsModification="";
let editableReview = [];
/**
** Open review form from edit button.
**/
const editReview = (event) => {
  self.editableReview = [];
  self.reviewInitiator="";
  self.reviewsModification = "edit";
  self.reviewInitiator=document.getElementById(event.target.id);
  const reviewId = event.target.id.split("_").pop();
  self.editableReview = self.reviews.filter(r => r.id == reviewId)[0];
  displayAddReviewModal();
};
/**
** Open / close review form.
**/
const toggleReviewForm = (event) => {
  const action = event.target.getAttribute("id").split("_").pop();
  switch(action) {
    case "close":
      hideAddReviewModal();
      break;
    case "open":
      self.reviewInitiator="";
      self.reviewInitiator=document.getElementById("rev_btn_open");
      self.reviewsModification="add";
      displayAddReviewModal();
      break;
  }
};
/**
** Display add review modal box.
**/
const displayAddReviewModal = () => {
  if (self.reviewInitiator.id==="rev_btn_open") {
    initReviewForm();
  }else{
    initEditReviewForm();
  }
  InterfaceManager.displayElement(self.reviewLayer);
  const namefield = document.getElementById("namefield");
  namefield.focus();
};

/**
** Hide add review modal box.
**/
const hideAddReviewModal = () => {
  InterfaceManager.hideElement(self.reviewLayer);
  initReviewForm();
  removeFormErrors();
  self.reviewInitiator.focus();
  self.editableReview = [];
  self.reviewsModification = "";
  self.reviewInitiator="";
};

/**
** Initialize rating stars.
**/
const initRatingStars = (stars=self.ratingStars) => {
  for (let i = 0; i < stars.length; i++) {
    stars[i].classList.remove("selected");
    document.getElementById(stars[i].getAttribute("for")).removeAttribute("checked");
  }
};

/**
** Check rating stars.
**/
const checkStars = (checkedstar, stars=self.ratingStars) => {
  initRatingStars();
  const checkedElement = stars[checkedstar];
  checkedElement.focus();
  let nextradio = document.getElementById(checkedElement.getAttribute("for"));
  nextradio.setAttribute("checked", true);
  for (let i = 0; i < nextradio.value; i++) {
    stars[i].classList.add("selected");
  }
};

/**
** Select rating stars on click.
**/
const selectRatingStar = (event) => {
  let currentstar = parseInt(event.target.id.split("star").pop());
  let nextstar = (currentstar+4)%5;
  checkStars(nextstar);
};

/**
** Get form errors of review.
**/
const getFormErrors = (userinput) => {
  self.focusAfterError=[];
  let formerrors = [];
  const inputKeys =  Object.keys(userinput);
  for (var i = 0; i < inputKeys.length; i++) {
    let key = inputKeys[i];
    if (key==="name") {
      const validname = textValidation(userinput.name, 2, true);
      if (validname!=null) {
        formerrors.push(validname+" your name!");
        self.focusAfterError.push("namefield");
      }
    }
    if (key==="rating" && userinput.rating==0) {
      formerrors.push("Please provide a rating for the restaurant by selecting the respective number of stars!");
      self.focusAfterError.push("rrstar_1");
    }
    if (key==="comments") {
      const validname = textValidation(userinput.comments, 1);
      if (validname!=null) {
        formerrors.push(validname+" your comments!");
        self.focusAfterError.push("commentsfield");
      }
    }
  }
  return formerrors;
};

/**
** Validate text fields for review.
**/
const textValidation = (value, chars, oneletter=false) => {
  const numbpattern = new RegExp(`^[0-9]+$`);
  const charpattern = new RegExp(`^(?=.*[a-zA-Z]).{2,}$`);
  if(value ===''){
    return "Please provide";
  } else if(value.replace(/\s+/, "") === ''){
    return "Only spaces are NOT allowed for";
  }else if (numbpattern.test(value)) {
    return "Only numbers are NOT allowed for";
  }else if(value.length<chars){
    let chartext = chars===1?"one character":"two characters";
    return `At least ${chartext} are required for`;
  }else if (!charpattern.test(value) && value.length>=2 && oneletter===true) {
    return "At least one letter is required for";
  }else {
    return null;
  }
};

/**
** Create and display form errors.
**/
const displayReviewFormErrors = (errors, reviewModal = self.reviewModal) => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "formError";
  errorContainer.setAttribute("role", "alert");
  errorContainer.setAttribute("aria-live", "assertive");
  const warning = document.createElement("i");
  warning.classList.add("fas", "fa-exclamation-triangle", "formwarning");
  const h4 = document.createElement("h4");
  h4.className = "errortitle";
  h4.innerHTML = "There are some errors in your review!";
  const errorList = document.createElement("ol");
  errorList.setAttribute("id", "errorsList");
  errorList.setAttribute("aria-label", "error list of review");
  for (let i = 0; i < errors.length; i++) {
    let li = document.createElement("li");
    li.setAttribute("role" , "listitem");
    li.innerHTML = errors[i];
    errorList.append(li);
  }
  const okBtn = InterfaceManager.createButton("error_close_btn", "ok", "close form errors", closeFormErrors);
  okBtn.title="Close form errors!";
  errorContainer.append(warning, h4, errorList, okBtn);
  reviewModal.append(errorContainer);
  document.getElementById("error_close_btn").focus();
};

/**
** Remove form errors.
**/
const removeFormErrors = () => {
  const formerror = document.querySelectorAll(".formError");
  if (formerror.length>0) {
    formerror[0].remove();
  }
  self.focusAfterError=[];
};

/**
** Close form errors and focus on the first error field.
**/
const closeFormErrors = (event) => {
  document.getElementById(self.focusAfterError[0]).focus();
  removeFormErrors();
};

/**
** Initialize review form.
**/
const initReviewForm = () => {
  initRatingStars();
  document.getElementById("namefield").value="";
  document.getElementById("commentsfield").value="";
};

/**
** Initialize review form for edit.
**/
const initEditReviewForm = () => {
  checkStars(self.editableReview.rating-1);
  document.getElementById("namefield").value = self.editableReview.name;
  document.getElementById("commentsfield").value = self.editableReview.comments;
};
/**
** Clear review form.
**/
const clearReviewForm = (event) => {
  event.preventDefault();
  initReviewForm();
  removeFormErrors();
};
/**
** Trap and handle navigation when form is open.
**/
const trapModalKeys = (event) => {
  const focusableElements = document.querySelectorAll(".modalfocusable");
  const firstStop = focusableElements[0];
  const lastStop = focusableElements[focusableElements.length - 1];
  const targetid = event.target.id;
  if (event.keyCode === 27) {// ESCAPE
    event.preventDefault();
    hideAddReviewModal();
  }else if (event.keyCode === 13 && targetid.startsWith("rrstar_")) {// ENTER
    event.preventDefault();
    let currentstar = parseInt(targetid.split("_").pop());
    let nextstar = (currentstar+4)%5;
    checkStars(nextstar);
  }else if (event.keyCode === 13 && targetid==="namefield") {// ENTER
    event.preventDefault();
  }else if (event.keyCode === 9 && event.shiftKey===true) {// SHIFT + TAB
    if (targetid==="rev_btn_close") {
      event.preventDefault();
      let formerror = document.querySelectorAll(".formError");
      if (formerror.length>0) {
        document.getElementById("error_close_btn").focus();
      }else{
        lastStop.focus();
      }
    }else if (targetid.startsWith("rrstar_")) {
      event.preventDefault();
      focusableElements[1].focus();
    }else if (targetid==="error_close_btn") {
      event.preventDefault();
      firstStop.focus();
    }
  }else if (event.keyCode === 9 && event.shiftKey===false) {// TAB
    if (targetid==="error_close_btn" || targetid==="rev_submit") {
      event.preventDefault();
      firstStop.focus();
    } else if (targetid==="namefield") {
      event.preventDefault();
      self.ratingStars[0].focus();
    } else if (targetid.startsWith("rrstar_")) {
      event.preventDefault();
      focusableElements[7].focus();
    } else if (targetid==="rev_btn_close") {
      let formerror = document.querySelectorAll(".formError");
      if (formerror.length>0) {
        event.preventDefault();
        document.getElementById("error_close_btn").focus();
      }
    }
  }else if ((event.keyCode === 39 || event.keyCode === 40) && targetid.startsWith("rrstar_")) {//RIGHT OR DOWN ARROW
    event.preventDefault();
    const nextstar = targetid.split("_").pop();
    checkStars(nextstar);
  }else if ((event.keyCode === 37 || event.keyCode === 38) && targetid.startsWith("rrstar_")) {//LEFT OR UP ARROW
    event.preventDefault();
    const currentstar = parseInt(targetid.split("_").pop());
    const nextstar = (currentstar+3)%5;
    checkStars(nextstar);
  }else {
    return;
  }
};
/**
** Get user input.
**/
const getUserInput = () => {
  const name = document.getElementById("namefield").value.toString().trim();
  const ratingField = document.querySelector('input[name="userrating"]:checked');
  const comments = document.getElementById("commentsfield").value.toString().trim();
  let rating = 0;
  if (ratingField!=null) {
    rating=parseInt(ratingField.value);
  }
  const userinput = {
    "name": name,
    "rating": rating,
    "comments": comments
  };
  return userinput;
}
/**
** Submit review form.
**/
const submitReviewForm = (event) => {
  event.preventDefault();
  switch (self.reviewsModification) {
    case "add":
      submitNewReview();
      break;
    case "edit":
      submitReviewEditing();
      break;
    }
};
/**
** Submit new review.
**/
const submitNewReview = () => {
  const userinput = getUserInput();
  const formerrors = getFormErrors(userinput);
  if (formerrors.length>0) {
    displayReviewFormErrors(formerrors);
  }else{
    const newReview = userinput;
    newReview.restaurant_id = parseInt(self.restaurant.id);
    newReview.createdAt = Date.now();
    newReview.updatedAt = Date.now();
    hideAddReviewModal();
    DBHelper.postReview(newReview).then((response)=>{
      switch (response.request_status) {
        case "fail":
          generateFailureNotification(DBHelper.INDEXED_DB_SUPPORT);
          if (DBHelper.INDEXED_DB_SUPPORT) {
            self.reviews.push(response.data);
            fillRatingStats();
            fillReviewsHTML();
          }
          break;
        default:
          self.reviews.push(response.data);
          fillRatingStats();
          fillReviewsHTML();
          break;
      }
    });
  }
};




/**
** Submit review editing.
**/
const submitReviewEditing = (editableReview = self.editableReview) => {
  const userinput = getUserInput();
  if (userinput.name.toLowerCase()===editableReview.name.toLowerCase() &&
    parseInt(userinput.rating)===parseInt(editableReview.rating) &&
    userinput.comments.toLowerCase()===editableReview.comments.toLowerCase()) {
    hideAddReviewModal();
  }else{
    const formerrors = getFormErrors(userinput);
    if (formerrors.length>0) {
      displayReviewFormErrors(formerrors);
    }else{
      const newReview = userinput;
      newReview.restaurant_id = parseInt(editableReview.restaurant_id);
      newReview.createdAt = editableReview.createdAt;
      newReview.updatedAt = Date.now();
      newReview.id = editableReview.id;
      hideAddReviewModal();
      DBHelper.updateReview(newReview).then((response)=>{
        switch (response.request_status) {
          case "fail":
            generateFailureNotification(DBHelper.INDEXED_DB_SUPPORT);
            if (DBHelper.INDEXED_DB_SUPPORT) {
              updateViewAfterReviewEdit(response.data);
            }
            break;
          default:
            updateViewAfterReviewEdit(response.data);
            break;
        }
      });
    }
  }
};
/**
** Update view after editing a review.
**/
const updateViewAfterReviewEdit = (editedRev) => {
  let updatedRevs = [];
  for (let i = 0; i < self.reviews.length; i++) {
    if (self.reviews[i].id===editedRev.id) {
      updatedRevs.push(editedRev);
    }else {
      updatedRevs.push(self.reviews[i]);
    }
  }
  self.reviews = [];
  self.reviews = updatedRevs;
  fillRatingStats();
  fillReviewsHTML();
};
/**
** Delete a review.
**/
const deleteReview = (event) => {
  const reviewId = event.target.id.split("_").pop();
  DBHelper.deleteReview(reviewId).then((response)=>{
    switch (response.request_status) {
      case "fail":
      generateFailureNotification(DBHelper.INDEXED_DB_SUPPORT);
      if (DBHelper.INDEXED_DB_SUPPORT) {
          self.reviews = self.reviews.filter(r => r.id != reviewId);
          fillRatingStats();
          fillReviewsHTML();
        }
        break;
      default:
        self.reviews = self.reviews.filter(r => r.id != reviewId);
        fillRatingStats();
        fillReviewsHTML();
        break;
    }
  });
};
