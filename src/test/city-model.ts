import Database from '../util/database';
import City from '../model/City';

const city = new City();

const showCities = async () => {
  await Database.instance?.open();
  const cities = await city.get();
  await Database.instance?.close();
  if (cities) {
    for (const c of cities) {
      console.log(c);
    }
  }
};

const showCitiesById = async () => {
  await Database.instance?.open();
  const cities = await city.get({ id: 5181 });
  await Database.instance?.close();
  if (cities) {
    for (const c of cities) {
      console.log(c);
    }
  }
};

const showCitiesByState = async () => {
  await Database.instance?.open();
  const cities = await city.get({ state: 26 });
  await Database.instance?.close();
  if (cities) {
    for (const c of cities) {
      console.log(c);
    }
  }
};

// showCities();
//showCitiesById();
showCitiesByState();
