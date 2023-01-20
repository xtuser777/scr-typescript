import State from '../model/State';
import Database from '../util/database';

const state = new State();

const showStates = async () => {
  await Database.instance?.open();
  const states = await state.get();
  await Database.instance?.close();
  if (states) {
    for (const state of states) {
      console.log(state);
    }
  }
};

const showStatesById = async () => {
  await Database.instance?.open();
  const states = await state.get({ id: 26 });
  await Database.instance?.close();
  if (states) {
    console.log(states[0]);
  }
};

const execTests = async () => {
  await showStates();
  console.log();
  console.log();
  await showStatesById();
};

execTests();
