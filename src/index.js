import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImg } from './img-api';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const targetEl = document.querySelector('.guard');

let lightbox = new SimpleLightbox('.photo-card a');
let param;
let currentPage = 1;
let options = {
  root: null,
  rootMargin: "300px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      console.log(param);
      getImg(param, currentPage)
        .then(data => {
          if (data.hits.length === 0) {
            throw new Error();
          }
          const markup = data.hits
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

          galleryEl.insertAdjacentHTML('beforeend', markup);
          lightbox.refresh();
          console.log(data.totalHits / 40);
          // if (currentPage >= data.totalHits / 40) {
          //   observer.unobserve(targetEl);
          // }
        })
        .catch(error =>
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          )
        );
    }
  });
}

function searchImg(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  const {
    elements: { searchQuery },
  } = event.currentTarget;

  param = searchQuery.value;

  getImg(param, currentPage)
    .then(data => {
      if (data.hits.length === 0) {
        throw new Error();
      }
      const markup = data.hits
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

      galleryEl.insertAdjacentHTML('beforeend', markup);
      observer.observe(targetEl);
      lightbox.refresh();
    })
    .catch(error =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

formEl.addEventListener('submit', searchImg);
