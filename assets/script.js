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
        
        var mypush = database.ref().child("books").push({
            upVotes:0,
            downVotes:0,
            bookStoredID: response.id,
            bookStoredTitle: response.volumeInfo.title,
            bookStoredAuthor: response.volumeInfo.authors[0],
            bookStoredImage: response.volumeInfo.imageLinks.smallThumbnail,
        });
        var key = mypush.getKey() 
        console.log(key)
        $("#recommendations").append("<div class = 'bookTitleDivAdded' id="+ response.id+"> <div>"+ response.volumeInfo.title +"</div>");
        $("#recommendations").append("<div class= 'bookAuthorDivAdded' id="+ response.id+"> <div>"+ response.volumeInfo.authors[0]+"</div>");
        $("#recommendations").append("<div class = 'bookImageDivAdded' id="+ response.id + "> <div>"+ "<img src='" +  response.volumeInfo.imageLinks.smallThumbnail +"'</div>");
        $("#recommendations").append("<button class= 'upVoteButton' id ='" + response.id + " key="+key + "'>UpVote</button>");
        //create value and put value inside 
        $("#recommendations").append("<button class= 'downVoteButton' id ='" + response.id + " key="+key + "'>Downvote</button>");
        
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



$(document).on("click", ".recommendedBookButton", function(e){
    console.log("You clicked me!!");
    e.preventDefault();
    var bookID = $(this).attr("id");
    console.log(bookID);
    addBooktoFirebase(bookID);
});

$(document).on("click", ".upVoteButton", function(){
    var key = $(this).attr("key")
    var value = $(this).attr("value")
    console.log (key)
    database.ref().child("/books/" + key).update({
        upVotes: value+1
    })
    //create attr from numbera
})

//error upvotes not defined +1
//store upotes and downvotes inside of the button, so in the onclick set it equal to 