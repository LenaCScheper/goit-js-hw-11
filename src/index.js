import './css/styles.css';
import galleryTmplt from './templates/pictures.hbs';
import { Notify } from 'notiflix';
import PicturesApiService from './js/apiService.js';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  inputForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.inputForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onPicturesFetchAndMarkup);


function onFormSubmit(e) {
  e.preventDefault();

  picturesApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  console.log(picturesApiService.searchQuery);

  if (picturesApiService.searchQuery === '') {
    return Notify.failure('please enter your request');
  }

  picturesApiService.resetPage();
  clearContainer();

  onPicturesFetchAndMarkup();
}

const picturesApiService = new PicturesApiService();
console.log('picturesApiService before build  ', picturesApiService);

async function onPicturesFetchAndMarkup() {
  await picturesApiService.fetchPictures().then(appendPicturesMarkup);
  // .then(()=>if (page > 1) { smoothScroll});
}

function appendPicturesMarkup(dataReceived) {
  if (dataReceived.totalHits === 0) {
    hideLoadMoreBtn();
    clearContainer();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again',
    );
  }

  Notify.success(`Hooray! We found ${dataReceived.totalHits} images`);

  refs.gallery.insertAdjacentHTML('beforeend', galleryTmplt(dataReceived.hits));

  showLoadMoreBtn();

  bigPicture();

  if (picturesApiService.page > 2) {
    smoothScroll();
  }

  onSearchFinishCheck(dataReceived);
}

function clearContainer() {
  refs.gallery.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('hidden');
}



function onSearchFinishCheck(dataReceived) {
  if (
    picturesApiService.page ===
    1 + Math.ceil(dataReceived.totalHits / picturesApiService.per_page)
  ) {
    hideLoadMoreBtn();
    return Notify.warning("That's it! You've reached the end of search results");
  }
}

function bigPicture() {
  var lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
