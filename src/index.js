import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImg } from './img-api';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const targetEl = document.querySelector('.guard');

let currentPage = 1;
let options = {
    root: null,
    rootMargin: '300px',
    threshold: 1.0
}

var observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentPage += 1;
      }
    });
}

formEl.addEventListener('submit', searchImg);

function searchImg(event) {
  event.preventDefault();
  galleryEl.innerHTML='';
  const {
    elements: {searchQuery},
  } = event.currentTarget;
  
  const param = searchQuery.value;

  getImg(param)
    .then(data => {
      if (data.length === 0) {
        throw new Error();
      }
      const markup = data
        .map(
          ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) =>
            `<div class="photo-card">
        <a class="gallery-link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${downloads}</span>
            </p>
          </div>
        </a>
    </div>`
        )
        .join('');

      galleryEl.insertAdjacentHTML('afterbegin', markup);

      let lightbox = new SimpleLightbox('.photo-card a');
    })
    .catch(error =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}
