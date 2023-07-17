import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38292054-24d10c6ab751dde75bf1a43b0';

export async function getImg(param, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}`,
    {
      params: {
        q: param,
        per_page: 40,
        page:page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    }
  );
  const data = {
    totalHits: response.data.totalHits,
    hits: response.data.hits,
  };
  return data;
}
