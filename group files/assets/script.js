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
    }
    
//         var author = response.items[0].value;
//         var imageSrc = bookInfo.imageLinks.thumbnail;
    })
}

$("#book-submit").submit(function(e){
    e.preventDefault();
    var book = $("#book").val();
    getBooks(book);
    console.log(book)
})





// $("#books-continer").append(
//     '<div class ="book-container"><h2> class="book-title">
//     ${title} </h2>
//     img src=${imageSrc}>
// </div>)

// )})