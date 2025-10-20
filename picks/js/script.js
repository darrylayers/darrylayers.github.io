const API_KEY = config.API_KEY;
const BASE_URL = config.BASE_URL;

async function init() {
  let reviews = await readJsonReviews();
  let collectedMedia = await fetchData(reviews);
  populateWebpageData(collectedMedia);
  console.log(collectedMedia);
}

// https://image.tmdb.org/t/p/original/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg
function populateWebpageData(collectedMedia) {
  const mediaContainer = document.getElementById("media");
  for (const media of collectedMedia) {
    const mediaDiv = document.createElement("div");
    mediaDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/original${media.posterPath}" alt="${media.title} poster">
      <div class="media-info">
        <p class="media-title">${media.title}</p>      
        <p>⭐ My Rating: ${media.myRating}/10</p>
        <p>📅 Watched: ${media.watchDate}</p>
      </div>`;
    mediaContainer.appendChild(mediaDiv);
  }
}

// Retrieve the reviews from the .json file
async function readJsonReviews() {
  try {
    const response = await fetch("../assets/reviews.json");
    return await response.json();
  } catch (error) {
    console.error("ERROR LOADING REVIEWS: ", error);
  }
}

// Fetch movie and tv show data for each given review
async function fetchData(reviews) {
  let collectedMedia = [];
  for (const review of reviews) {
    const response = await fetch(
      `${BASE_URL}/${review.type}/${review.tmdbId}?api_key=${API_KEY}`
    );
    const data = await response.json();
    let { overview, poster_path, release_date, runtime } = data;

    collectedMedia.push({
      tmdbId: review.tmdbId,
      title: review.title,
      myRating: review.myRating,
      myReview: review.review,
      watchDate: review.watchDate,
      overview: overview,
      posterPath: poster_path,
      releaseDate: release_date,
      runtime: runtime,
    });
  }
  return collectedMedia;
}

init();
