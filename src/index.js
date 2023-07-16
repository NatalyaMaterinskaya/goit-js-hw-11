import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImg } from './img-api';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

formEl.addEventListener('submit', searchImg);

function searchImg(event) {
  event.preventDefault();

  const {
    elements: {searchQuery},
  } = event.currentTarget;
  
  const param = searchQuery.value;

  getImg(param)
    .then(data => {
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
              <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads ${downloads}</b>
            </p>
          </div>
        </a>
    </div>`
        )
        .join('');

      galleryEl.insertAdjacentHTML('afterbegin', markup);

      let lightbox = new SimpleLightbox('.photo-card a');
    })
    .catch(error => console.log(error));
}
