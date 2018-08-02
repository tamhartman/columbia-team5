// Initialize Firebase
var config = {
    apiKey: "AIzaSyDbL2lk3l5MsVU_jCrXiTxIALMBgnuxDds",
    authDomain: "team-5-database.firebaseapp.com",
    databaseURL: "https://team-5-database.firebaseio.com",
    projectId: "team-5-database",
    storageBucket: "team-5-database.appspot.com",
    messagingSenderId: "190094022793"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Use the below initialValue
var numberofSearches = 0;

//API function to get book SEARCH information from Google API
function getBooks(book) {
    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes?q=" + book,
        method:"GET"
    }).then(function(response){
        console.log(response);
        var bookInfo = response.items;
        console.log(bookInfo);

//For loop for the number of results that are given from the Google API
//Results are appended on top of one another 
   
    for (var i = 0; i < response.items.length; i++) {
        console.log(response.items[i].volumeInfo.title);

        $("#book-div").append("<div class = 'bookTitleDiv' id="+ response.items[i].id+"> <div>"+ response.items[i].volumeInfo.title +"</div>");
        $("#book-div").append("<div class= 'bookAuthorDiv' id="+ response.items[i].id+"> <div>"+ response.items[i].volumeInfo.authors+"</div>");
        $("#book-div").append("<div class = 'bookImageDiv' id="+ response.items[i].id + "> <div>"+ "<img src='" +  response.items[i].volumeInfo.imageLinks.smallThumbnail +"'</div>");
        $("#book-div").append("<button class= 'recommendedBookButton' id ='" + response.items[i].id + "'>Recommend</button>");
    }  

});

};

// //API function to get book ID information from Google API
function addBooktoFirebase(bookID) {
    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes/" + bookID,
        method:"GET"
    }).then(function(response){
        console.log(response);
        
        database.ref().set({
            bookStoredID: response.id,
            bookStoredTitle: response.volumeInfo.title,
            bookStoredAuthor: response.volumeInfo.authors,
            bookStoredImage: response.volumeInfo.imageLinks.smallThumbnail,
        });
        
    });
};

//On-click function when the user clicks submit 
//Captures the user input data and then runs the getBooks function

$("#book-entry").on("click", function(e){
    e.preventDefault();
    var book = $("#book").val();
    getBooks(book);
    setTimeout(function(){
        addRecommendedBookClickHandlers();
    }, 1000);
    console.log(book)
    numberofSearches++;
    database.ref().set({
        numberofSearch: numberofSearches
    });
});

//On-click function from the user recommending a book from the list of searched books 
//The information for the selected book will first be stored to Firebase



function addRecommendedBookClickHandlers() {
        $(".recommendedBookButton").on("click", function(e){
        console.log("You clicked me!!");
        e.preventDefault();
        var bookID = $(this).attr("id");
        console.log(bookID);
        addBooktoFirebase(bookID);
        });
}
