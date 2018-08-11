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

//Load Recommendations upon page load from Firebase database 

database.ref("/books/").on("child_added", function(snapshot){
    console.log(snapshot.key);

    database.ref("/books/" + snapshot.key).once("value", function (snap) {
        bookTitle = snap.val().bookStoredTitle;
        console.log(bookTitle);
        $("#recommendations").append("<div class = 'bookTitleDivAdded'> <div>" + bookTitle + "</div>");

    });

    database.ref("/books/" + snapshot.key).once("value", function (snap) {
        bookAuthor = snap.val().bookStoredAuthor;
        console.log(bookAuthor);
        $("#recommendations").append("<div class= 'bookAuthorDivAdded'> <div>" + bookAuthor + "</div>");

    });

    database.ref("/books/" + snapshot.key).once("value", function (snap) {
        bookImage = snap.val().bookStoredImage;
        console.log(bookImage);
        $("#recommendations").append("<div class = 'bookImageDivAdded'> <div>" + "<img src='" + bookImage + "'</div>");

    });

    database.ref("/books/" + snapshot.key).once("value", function (snap) {
        upVoteValue = parseInt(snap.val().upVotes);
        console.log(upVoteValue);
        $("#recommendations").append("<div class= 'upVotesDiv'> <div>" + upVoteValue + "</div>");
        
    });

    database.ref("/books/" + snapshot.key).once("value", function (snap) {
        downVoteValue = parseInt(snap.val().downVotes);
        console.log(downVoteValue);
        $("#recommendations").append("<div class= 'downVotesDiv'> <div>" + downVoteValue + "</div>");

    });

    database.ref("/books/" + snapshot.key).once("value", function (snap) {
        bookID = snap.val().bookStoredID;
        console.log(bookID);
        $("#recommendations").append("<button class= 'btn btn-success upVoteButton' id ='" + bookID + "' key='" + snapshot.key + "'>UpVote</button>");
        $("#recommendations").append("<button class= 'btn btn-danger downVoteButton' id ='" + bookID + "' key='" + snapshot.key + "'>Downvote</button>");

    });

});

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
        $("#book-div").append("<br><div class='col><div class='card'><div class = 'bookImageDiv' id="+ response.items[i].id + "><div>"+ "<img src='" +  response.items[i].volumeInfo.imageLinks.smallThumbnail +">'</div>'");
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
            $("#recommendations").append("<br><div class='col><div class='card'><div class = 'bookImageDivAdded' id='" + response.id + "'> <div>" + "<img src='" + response.volumeInfo.imageLinks.smallThumbnail + "'</div></div></div>");
            $("#recommendations").append("<h3><div class = 'card-title bookTitleDivAdded' id='" + response.id + "'> <div>" + response.volumeInfo.title + "</h3></div>");
            $("#recommendations").append("<div class= 'card-subtitle mb-2 text-muted bookAuthorDivAdded' id='" + response.id + "'> <div>" + response.volumeInfo.authors[0] + "</div>");
            $("#recommendations").append("<button class= 'btn btn-success upVoteButton' id ='" + response.id + "' key='" + key + "'>UpVote</button>");
            $("#recommendations").append("<button class= 'btn btn-danger downVoteButton' id ='" + response.id + "' key='" + key + "'>Downvote</button>");
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
    var upVoteValue;
    database.ref("/books/" + key).once("value", function (snap) {
        upVoteValue = parseInt(snap.val().upVotes);
        database.ref("/books/" + key).update({
            upVotes: upVoteValue += 1
        }, function (error) {
            console.log(error);
        }
        );
    });
};

function addDownVote(key) {
    var downVoteValue;
    database.ref("/books/" + key).once("value", function (snap) {
        downVoteValue = parseInt(snap.val().downVotes);
        database.ref("/books/" + key).update({
            downVotes: downVoteValue += 1
        }, function (error) {
            console.log(error);
        }
        );
    });
};

//On-click function when the user clicks submit 
//Captures the user input data and then runs the getBooks function

$("#book-entry").on("click", function (e) {
    e.preventDefault();
    var book = $("#book").val();
    
    setTimeout(function () {
        getBooks(book);
    }, 0);
    numberofSearches++;
    database.ref("numberofSearch").set(numberofSearches);
});

//On-click function from the user recommending a book from the list of searched books 
//The information for the selected book will first be stored to Firebase



$(document).on("click", ".recommendedBookButton", function (e) {
    e.preventDefault();
    var bookID = $(this).attr("id");
    addBooktoFirebase(bookID);
    setTimeout(function () {
        // addUpVoteBookHandlers();
        // addDownVoteBookHandlers();
    }, 0);
});

//On-click function for UpVote - adds to the UpVote count in Firebase


$(document).on("click", ".upVoteButton", function (e) {
    e.preventDefault();
    var key = $(".upVoteButton").attr("key");
    addUpVote(key);
});

//On-click function for DownVote - add to the DownVote count in Firebase 


$(document).on("click", ".downVoteButton", function (e) {
    e.preventDefault();
    var key = $(".downVoteButton").attr("key");
    addDownVote(key);
});