import City from './model/City';
import State from './model/State';

const state = new State();
const city = new City();

const showStates = async () => {
  const states = await state.get({ id: 26 });
  if (states) {
    for (const state of states) {
      console.log(state);
    }
  }
};

const showCities = async () => {
  const cities = await city.get({ state: 1 });
  if (cities) {
    for (const c of cities) {
      console.log(c);
    }
  }
};

showCities();
