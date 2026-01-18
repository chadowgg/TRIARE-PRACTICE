const url = 'https://www.course-api.com/react-tours-project';

type Tour = {
  id: string;
  name: string;
  info: string;
  image: string;
  price: number;
};

async function fetchData(url: string): Promise<Tour[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data: Tour[] = await response.json();

    return data;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : 'Error while fetching data';
    console.log(errorMsg);
    return [];
  }
}

fetchData(url).then((tours) => {
  tours.map((tour) => console.log(tour.name));
});