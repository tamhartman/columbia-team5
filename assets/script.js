function getBooks(book) {
$.ajax({
    url: "https://www.googleapis.com/books/v1/volumes?q=" + book,
    method:"GET"
}).then(function(response){
    console.log(response);
  
    var bookInfo = response.items
    ;

    console.log(bookInfo);
   
    for (var i = 0; i < response.items.length; i++) {
        console.log(response.items[i].volumeInfo.title);
        $("#book-div").prepend("<div id="+ response.items[i].id+"> <div>"+ response.items[i].volumeInfo.title +"</div>");
        $("#book-div").prepend("<div id="+ response.items[i].id+"> <div>"+ response.items[i].volumeInfo.authors+"</div>");
       $("#book-div").prepend("<div id="+ response.items[i].id + "> <div>"+ "<img src='" +  response.items[i].volumeInfo.imageLinks.smallThumbnail +"'</div>");
       $("#book-div").prepend("<button id='upvoteButton'>Upvote</button>");
       $("#book-div").prepend("<button id='downvoteButton'>Downvote</button>");
 
       
    }
    
    })
  }

$("#book-submit").submit(function(e){
    e.preventDefault();
    var book = $("#book").val();
    getBooks(book);
    console.log(book)
})





 