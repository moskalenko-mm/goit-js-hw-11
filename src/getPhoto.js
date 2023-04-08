import axios from 'axios';

export async function getPhoto(userRequest, page) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '35077091-92ff1995237b3143746e74653',
      q: userRequest,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  });
  return response.data;
}
