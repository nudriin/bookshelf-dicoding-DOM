const list = 'BOOK_LIST';
const saveBook = (request) => {
    if(localStorage.getItem(list) === null){
        const data = [];
        data.push(request);
        localStorage.setItem(list, JSON.stringify(data));
    } else {
        const response = localStorage.getItem(list);
        const book = JSON.parse(response);
        book.push(request);
        localStorage.setItem(list, JSON.stringify(book));
    }
}

const findAllBook = () => {
    if(localStorage.getItem(list) == null) {
        return [];
    }
    const response = localStorage.getItem(list);
    const books = JSON.parse(response);

    return books;
}

const findIndexBookById = (bookId) => {
    const books = findAllBook();

    for(const index in books){
        if(books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

const searchBook = (bookTitle) => {
    const books = findAllBook();
    const found = [];

    for(const book of books) {
        if(book.title.toLowerCase().includes(bookTitle.toLowerCase())){
            found.push(book);
        }
    }

    return found;
}

const setBookStatus = (bookId) => {
    const books = findAllBook();
    for(const book of books){
        if(book.id === bookId) {
            book.isComplete = !book.isComplete;
        }
    }
    
    localStorage.setItem(list, JSON.stringify(books));   
}

const removeBook = (bookId) => {
    const books = findAllBook();
    const index = findIndexBookById(bookId);
    
    if(index === -1) return;
    
    books.splice(index, 1);
    localStorage.setItem(list, JSON.stringify(books));
}

const bookCount = () => {
    const books = findAllBook();
    return books.length;
}

const inCompleteCount = () => {
    const books = findAllBook();
    let count = 0;
    for(const book of books){
        if(!book.isComplete){
            count += 1;
        }
    }

    return count;
}

const completeCount = () => {
    const books = findAllBook();
    let count = 0;
    for(const book of books){
        if(book.isComplete){
            count += 1;
        }
    }

    return count;
}

export default {
    saveBook,
    findAllBook,
    findIndexBookById,
    setBookStatus,
    removeBook,
    searchBook,
    bookCount,
    inCompleteCount,
    completeCount
}