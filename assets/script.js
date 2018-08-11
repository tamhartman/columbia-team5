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
        method: "GET"
    }).then(function (response) {
        var bookInfo = response.items;


        //For loop for the number of results that are given from the Google API
        //Results are appended on top of one another 
   
    for (var i = 0; i < response.items.length; i++) {
        console.log(response.items[i].volumeInfo.title);
        $("#book-div").append("<br><div class='col-auto mb-3'><div class='card'><div class = 'bookImageDiv' id="+ response.items[i].id + "><div>"+ "<img src='" +  response.items[i].volumeInfo.imageLinks.smallThumbnail +">'</div>'");
        $("#book-div").append("<h3><div class = 'card-title bookTitleDiv' id="+ response.items[i].id+"> <div>"+ response.items[i].volumeInfo.title +"</div></h3>");
        $("#book-div").append("<div class= 'card-subtitle mb-2 text-muted bookAuthorDiv' id="+ response.items[i].id+"> <div>"+ response.items[i].volumeInfo.authors+"</div>");
        $("#book-div").append("<button class= 'recommendedBookButton btn btn-success' id ='" + response.items[i].id + "'>Recommend</button></div></div><br>");
    }  

});

};
// //API function to get book ID information from Google API
function addBooktoFirebase(bookID) {
    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes/" + bookID,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var mypush = database.ref().child("books").push({
            upVotes: 0,
            downVotes: 0,
            bookStoredID: response.id,
            bookStoredTitle: response.volumeInfo.title,
            bookStoredAuthor: response.volumeInfo.authors[0],
            bookStoredImage: response.volumeInfo.imageLinks.smallThumbnail,
        });
        var key = mypush.getKey()
        $.ajax({
            url: "http://idreambooks.com/api/books/reviews.json?q=" + response.volumeInfo.title + "&key=c387b2b63b7a18f146681174b39950c1ce591fba",
            method: "GET"
        }).then(function (review) {
            var ReviewInfo = review;
            console.log(ReviewInfo);
            $("#recommendations").append("<div class = 'bookTitleDivAdded' id='" + response.id + "'> <div>" + response.volumeInfo.title + "</div>");
            $("#recommendations").append("<div class= 'bookAuthorDivAdded' id='" + response.id + "'> <div>" + response.volumeInfo.authors[0] + "</div>");
            $("#recommendations").append("<div class = 'bookImageDivAdded' id='" + response.id + "'> <div>" + "<img src='" + response.volumeInfo.imageLinks.smallThumbnail + "'</div>");
            $("#recommendations").append("<button class= 'upVoteButton' id ='" + response.id + "' key='" + key + "'>UpVote</button>");
            $("#recommendations").append("<button class= 'downVoteButton' id ='" + response.id + "' key='" + key + "'>Downvote</button>");
            if (review.book.critic_reviews.length > 0) {
                for (var i = 0; i < 2; i++) {
                    if (review.book.critic_reviews[i].snippet) {

                        $("#recommendations").append("<div class = 'review'>" + review.book.critic_reviews[i].snippet + "</div>")
                    }
                }
            }


        })

    });
};


function addUpVote(key) {
    console.log (key);
    var upVoteValue;
    database.ref("/books/" + key).once("value", function (snap){
        upVoteValue = parseInt(snap.val().upVotes);
        console.log(upVoteValue);
        database.ref("/books/" + key).update({
        upVotes: upVoteValue += 1 
        }, function(error) {
            console.log(error); 
        }
        );
    });
};

function addDownVote(key) {
    console.log (key);
    var downVoteValue;
    database.ref("/books/" + key).once("value", function (snap){
        downVoteValue = parseInt(snap.val().downVotes);
        console.log(downVoteValue);
        database.ref("/books/" + key).update({
        downVotes: downVoteValue += 1 
        }, function(error) {
            console.log(error); 
        }
        );
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
    }, 0);
    console.log(book)
    numberofSearches++;
    database.ref("numberofSearch").set(numberofSearches);
});

//On-click function from the user recommending a book from the list of searched books 
//The information for the selected book will first be stored to Firebase


var addRecommendedBookClickHandlers = function(){
    $(document).on("click", ".recommendedBookButton", function(e){
        e.preventDefault();
        console.log("You clicked me!!");
        var bookID = $(this).attr("id");
        console.log(bookID);
        addBooktoFirebase(bookID);
        setTimeout(function(){
            addUpVoteBookHandlers(); 
            addDownVoteBookHandlers();
        }, 0);
    });
};

//On-click function for UpVote - adds to the UpVote count in Firebase


var addUpVoteBookHandlers = function () {
    $(document).on("click", ".upVoteButton", function(e){
        e.preventDefault();
        var key = $(".upVoteButton").attr("key"); 
        console.log(key);
        addUpVote(key);
    })
};

//On-click function for DownVote - add to the DownVote count in Firebase 

var addDownVoteBookHandlers = function () {
    $(document).on("click", ".downVoteButton", function(e){
        e.preventDefault();
        var key = $(".downVoteButton").attr("key"); 
        console.log(key);
        addDownVote(key);
    })
};
    //reference trian exercise .child .val