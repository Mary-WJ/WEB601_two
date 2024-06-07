const noteForm = document.querySelector("form");
const noteTitle = document.querySelector(".titleHeader");
const noteContent = document.querySelector(".content");


noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const titleValue = noteTitle.value;
    if(!titleValue){
        alert("title can't be empty");
    }else{
    }



})