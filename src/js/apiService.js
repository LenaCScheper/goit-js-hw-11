import axios from 'axios';
const API_KEY = '24794721-8b40f8604d43363d1fa3375eb';
const BASE_URL = `https://pixabay.com/api/`;

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchPictures() {
    const searchParametrs = {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    };

    try {
      const response = await axios.get(BASE_URL, searchParametrs);

      const dataReceived = response.data;
      // console.log('DATA RECEIVED Fetchpictures Funct: ', dataReceived);
      this.incrementPage();
      return dataReceived;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
