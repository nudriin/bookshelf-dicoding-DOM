import service from "./service.mjs";
let formData = {};
formData.isComplete = false;

let books = [];

const confirmContainer = document.querySelector('#confirmContainer');
const yes = document.querySelector('#yes');
const no = document.querySelector('#no');
const addBtn = document.querySelector('.add');
const modalSection = document.querySelector('.modal-section');
const inputs = document.querySelectorAll('#inputBook input');
const submit = document.querySelector('#bookSubmit');
const inComplete = document.querySelector('.incomplete');
const complete = document.querySelector('.complete');
const search = document.querySelector('#searchBookTitle');
const bookList = document.querySelector('.book-list');
const completeCountContainer = document.querySelector('#completeCount');
const incompleteCountContainer = document.querySelector('#incompleteCount');
const bookCountContainer = document.querySelector('#countBook');

const refreshDOM = () => {
    complete.innerHTML = '';
    inComplete.innerHTML = '';
    bookList.innerHTML = '';
    bookCountContainer.innerHTML = '';
    incompleteCountContainer.innerHTML = '';
    completeCountContainer.innerHTML = '';
    loadBook();
}

const renderBook = (book) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const cardTitleElement = document.createElement('div');
    cardTitleElement.classList.add('card-title');

    const titleElement = document.createElement('h3');
    titleElement.innerText = book.title;

    const yearElement = document.createElement('p');
    yearElement.innerText = book.year;

    const cardSubtitleElement = document.createElement('div');
    cardSubtitleElement.classList.add('card-subtitle');

    const authorElement = document.createElement('p');
    authorElement.innerText = book.author;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const doneBtn = document.createElement('button');
    doneBtn.classList.add('done');
    book.isComplete ? doneBtn.innerText = 'Belum selesai' : doneBtn.innerText = 'Selesai';

    doneBtn.addEventListener('click', () => {
        service.setBookStatus(book.id);
        refreshDOM();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.innerText = "Hapus";

    deleteBtn.addEventListener('click', () => {
        openModal(confirmContainer);
        yes.addEventListener('click', () => {
            service.removeBook(book.id);
            refreshDOM();
            closeModal(confirmContainer);
        });
        
        no.addEventListener('click', () => {
            closeModal(confirmContainer);
        });
    });

    cardTitleElement.appendChild(titleElement);
    cardTitleElement.appendChild(yearElement);
    cardSubtitleElement.appendChild(authorElement);
    actionContainer.appendChild(doneBtn);
    actionContainer.appendChild(deleteBtn);

    cardElement.appendChild(cardTitleElement);
    cardElement.appendChild(cardSubtitleElement);
    cardElement.appendChild(actionContainer);

    if (book.isComplete) {
        complete.appendChild(cardElement);
    } else {
        inComplete.appendChild(cardElement);
    }
}

const renderList = (book) => {
    const ol = document.createElement('ol');
    const ul = document.createElement('ul');
    ul.innerText = book.title;

    ol.appendChild(ul);
    bookList.appendChild(ol);
}

const renderBookCount = () => {
    const bookTotal = service.bookCount();
    const p1 = document.createElement('p');
    p1.innerText = 'Total';
    const bookCount = document.createElement('h3');
    bookCount.innerText = bookTotal;

    const completeTotal = service.completeCount();
    const p2 = document.createElement('p');
    p2.innerText = 'Selesai';
    const completeCount = document.createElement('h3');
    completeCount.innerText = completeTotal;

    const incompleteTotal = service.inCompleteCount();
    const p3 = document.createElement('p');
    p3.innerText = 'Belum Selesai';
    const incompleteCount = document.createElement('h3');
    incompleteCount.innerText = incompleteTotal;

    bookCountContainer.appendChild(p1);
    bookCountContainer.appendChild(bookCount);
    completeCountContainer.appendChild(p2);
    completeCountContainer.appendChild(completeCount);
    incompleteCountContainer.appendChild(p3);
    incompleteCountContainer.appendChild(incompleteCount);
}

window.addEventListener('load', () => loadBook());

const loadBook = () => {
    books = service.findAllBook();
    books.forEach((book) => {
        renderBook(book);
        renderList(book);
    });
    renderBookCount();
}

const handleInput = (event) => {
    const { id, type, value, checked } = event.target;
    formData.id = new Date().getTime();
    if (type === 'checkbox') {
        formData[id] = checked;
    } else {
        id === 'year' ? formData[id] = Number(value) : formData[id] = value;
    }
}

const openModal = (modalElement) => {
    modalElement.setAttribute('style', 'visibility: visible;')
}

const closeModal = (modalElement) => {
    modalElement.setAttribute('style', 'visibility: hidden;');
}

addBtn.addEventListener('click', () => openModal(modalSection));

modalSection.addEventListener('click', (event) => {
    const modal = document.querySelector('.modal');
    if (!modal.contains(event.target)) {
        closeModal(modalSection);
    }
});

confirmContainer.addEventListener('click', (event) => {
    const modal = document.querySelector('.modal');
    if (!modal.contains(event.target)) {
        closeModal(confirmContainer);
    }
});

inputs.forEach(input => {
    input.addEventListener('input', handleInput);
});

submit.addEventListener('click', (event) => {
    event.preventDefault();
    service.saveBook(formData);
    refreshDOM();
    closeModal(modalSection);
});

search.addEventListener('input', () => {
    const response = service.searchBook(search.value);
    complete.innerHTML = '';
    inComplete.innerHTML = '';
    response.forEach((book) => {
        renderBook(book);
    })
});