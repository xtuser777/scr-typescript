import Database from '../util/database';
import City from '../model/City';

const city = new City();

const showCities = async () => {
  const cities = await city.get();
  if (cities) {
    for (const c of cities) {
      console.log(c);
    }
  }
};

const showCitiesById = async () => {
  const cities = await city.get({ id: 5181 });
  if (cities) {
    for (const c of cities) {
      console.log(c);
    }
  }
};
