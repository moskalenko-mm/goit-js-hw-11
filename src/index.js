import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhoto } from './getPhoto';

let page = 1;
let userRequest;
let totalPages;
let data;
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', handleFormSubmit);
loadBtn.addEventListener('click', loadNextPage);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  close: true,
});

lightbox.on('show.simplelightbox');

function renderCardsList(photos) {
  const markup = photos
    .map(photo => {
      return `
        <a class="gallery__item" href="${photo.largeImageURL}">
          <div class="photo-card">
            <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes ${photo.likes}</b>
              </p>
              <p class="info-item">
                <b>Views ${photo.views}</b>
              </p>
              <p class="info-item">
                <b>Comments ${photo.comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads ${photo.downloads}</b>
              </p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

async function handleFormSubmit(event) {
  event.preventDefault();
  clearMarkup();
  page = 1;
  userRequest = event.currentTarget.searchQuery.value.trim();
  if (userRequest) {
    data = await getPhoto(userRequest, page);
    console.log(data);
    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearMarkup();
      loadBtn.classList.add('visually-hidden');
    } else {
      if (page === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        totalPages = Math.ceil(data.totalHits / 40);
      }
      if (totalPages === page) {
        loadBtn.classList.add('visually-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      renderCardsList(data.hits);
      lightbox.refresh();
      console.log(totalPages);
      console.log(page);
      if (totalPages !== page) {
        loadBtn.classList.remove('visually-hidden');
      }
    }
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    clearMarkup();
  }
  searchForm.reset();
}

async function loadNextPage() {
  page += 1;

  if (totalPages === page) {
    loadBtn.classList.add('visually-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  //getPhoto(userRequest, page);
  data = await getPhoto(userRequest, page);
  renderCardsList(data.hits);
}
function clearMarkup() {
  gallery.innerHTML = '';
}
