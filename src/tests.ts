import State from './model/State';

const state = new State();

const showStates = async () => {
  const states = await state.get();
  if (states) {
    for (const state of states) {
      console.log(state);
    }
  }
};

showStates();
