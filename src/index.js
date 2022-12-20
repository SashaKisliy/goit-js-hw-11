import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix, { Notify } from 'notiflix';


const API_KEY = '32143605-ffafb661b3a663225209c63df';
const URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true';


const form = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.btn');


let page = '';
let value = '';


form.addEventListener('submit', submitForm);
btnLoadMore.addEventListener('click', clickLoadMore);


let gallery = new SimpleLightbox('.gallery-item', { 
  captionsData: 'alt',
  captionDelay: 250 
});


function submitForm (e) {
    e.preventDefault();

    galleryBox.innerHTML = '';

    value = e.target.elements.searchQuery.value.trim();

    page = 1;
    if (value === '') {
      Notify.warning('Write something for search!')
      btnLoadMore.classList.add('is-hidden')
      return 
    }
    console.log(page);
    form.reset();

    fetchPhotos(value).then(({hits, totalHits}) => {

      if (totalHits > 0) {
        totalFound(totalHits)
      }
      if (totalHits < 40) {
        btnLoadMore.classList.add('is-hidden')
      } else {
        btnLoadMore.classList.remove('is-hidden')
      }
      onMarkupPhotos(hits)
      gallery.refresh()
    }).catch(err => console.log(err))
} 



function clickLoadMore(e) {
  fetchPhotos(value).then(({hits, totalHits}) => {

    console.log(hits);
    console.log(totalHits);
    console.log(page);

    if (page * 40 >= totalHits) {
      btnLoadMore.classList.add('is-hidden')
      Notify.warning("We're sorry, but you've reached the end of search results.")
    }
    onMarkupPhotos(hits);
    gallery.refresh();
  }).catch(err => console.log(err))
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
        return `
        <div class="photo-card">
              <a class="gallery-item" href="${largeImageURL}"> 
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

    galleryBox.insertAdjacentHTML('beforeend', markupPhotos);
}






async function fetchPhotos(query) {
  const response = await axios.get(`${URL}&key=${API_KEY}&q=${query}&page=${page}&per_page=40`)
  const result = await response.data;

  page += 1;
  
  return result;
};




function notFound() {
  return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}

function totalFound(totalHits) {
  return Notify.success(`Hooray! We found ${totalHits} images.`)
}