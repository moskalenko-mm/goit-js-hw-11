import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

let page = 1;
let userRequest;
let totalPages;
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

function handleFormSubmit(event) {
  event.preventDefault();
  clearMarkup();
  page = 1;
  userRequest = event.currentTarget.searchQuery.value.trim();
  getPhoto(userRequest, page);
  //searchForm.reset();
}

async function getPhoto(userRequest, page) {
  await axios
    .get('https://pixabay.com/api/', {
      params: {
        key: '35077091-92ff1995237b3143746e74653',
        q: userRequest,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    })
    .then(response => {
      console.log(response);
      if (response.data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        clearMarkup();
        loadBtn.classList.add('visually-hidden');
      } else {
        if (page === 1) {
          Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
          totalPages = Math.ceil(response.data.totalHits / 40);
        }
        renderCardsList(response.data.hits);
        lightbox.refresh();
        console.log(totalPages);
        console.log(page);
        if (totalPages !== page) {
          loadBtn.classList.remove('visually-hidden');
        }
      }
    });
}

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

function loadNextPage() {
  page += 1;

  if (totalPages === page) {
    loadBtn.classList.add('visually-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  getPhoto(userRequest, page);
}
function clearMarkup() {
  gallery.innerHTML = '';
}
