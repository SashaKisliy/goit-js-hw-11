import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix, { Notify } from 'notiflix';

const API_KEY = '32143605-ffafb661b3a663225209c63df';
const URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true';

  // const API = axios.create({
  //     baseURL: 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true',
  //     headers: {
  //       "X-Api-Key": API_KEY
  //     }
  //   });

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery')

form.addEventListener('submit', submitForm)

function submitForm (e) {
    e.preventDefault();

    gallery.innerHTML = '';

    const value = e.target.elements.searchQuery.value;

    form.reset()

    getNews(value).then(({hits, totalHits}) => {
      console.log(hits);
      console.log(totalHits);
      onMarkupPhotos(hits)})
}






function onMarkupPhotos(photos) {

  if (photos.length === 0) {
    return notFound();
  }

  const markupPhotos = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
              <a href="${largeImageURL}"> 
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
              </a>
              <div class="info">
                <p class="info-item">
                  <b>Likes: </b>${likes}
                </p>
                <p class="info-item">
                  <b>Views: </b>${views}
                </p>
                <p class="info-item">
                  <b>Comments: </b>${comments}
                </p>
                <p class="info-item">
                  <b>Downloads: </b>${downloads}
                </p>
              </div>
      </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markupPhotos);
}


  function getNews(query) {
    return axios.get(`${URL}&key=${API_KEY}&q=${query}&page=1&per_page=40`)
    .then(res => {
      return res.data})
    // }).then(({hits, totalHits}) => {
    //   return {hits, totalHits}
    // })
};


function notFound() {
  return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}


function totalFound(totalHits) {
  return Notify.success(`Hooray! We found ${totalHits} images.`)
}