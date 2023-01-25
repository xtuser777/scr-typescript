import Database from '../util/database';
import Level from '../model/Level';

const showLevels = async (): Promise<void> => {
  await Database.instance.open();
  const levels = await new Level().get();
  await Database.instance.close();

  for (const level of levels) {
    console.log(level);
  }
};

const showsLevelById = async (id: number): Promise<void> => {
  await Database.instance.open();
  const level = (await new Level().get({ id }))[0];
  await Database.instance.close();

  console.log(level);
};

//showLevels();
showsLevelById(1);
