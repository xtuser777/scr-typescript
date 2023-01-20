import Address from '../model/Address';
import City from '../model/City';
import State from '../model/State';
import Database from '../util/database';

const state = new State();
const city = new City();
const address = new Address();

const showStates = async () => {
  const states = await state.get({ id: 26 });
  if (states) {
    for (const state of states) {
      console.log(state);
    }
  }
};

const showCities = async () => {
  const cities = await city.get({ id: 5181 });
  if (cities) {
    for (const c of cities) {
      console.log(c);
    }
  }
};

const showAddresses = async () => {
  const addresses = await address.get();
  if (addresses) {
    for (const address of addresses) {
      console.log(address);
    }
  }
};

const insertAddress = async () => {
  const address = new Address(0, 'teste', 7, 'teste', '', '77.777-000', new City(5181));
  const result = await address.save();
  console.log(result);
};

const updateAddress = async () => {
  await Database.instance?.open();
  Database.instance?.beginTransaction();
  const address = new Address(2, 'teste', 2, 'teste', '', '22.222-000', new City(5181));
  const result = await address.update();
  await Database.instance?.commit();
  await Database.instance?.close();
  console.log(result);
};

const deleteAddress = async () => {
  await Database.instance?.open();
  Database.instance?.beginTransaction();
  const address = new Address(6);
  const result = await address.delete();
  await Database.instance?.commit();
  await Database.instance?.close();
  console.log(result);
};

//showStates();
//showCities();

//insertAddress();
//updateAddress();
//deleteAddress();
showAddresses();
