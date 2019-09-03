import fs from 'fs';
import path from 'path';
import util from 'util';

const readdir = util.promisify(fs.readdir);


const scanDirectory = (directoryPath: string, callback: (fileList: string[]) => void) => {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    callback(files);
  });
};

export const getAllEncounterPaths = (callback: any) => {
  const encounterRoot = path.join(__dirname, '..', 'public', 'modules');
  const encounterPaths: any = [];
  scanDirectory(encounterRoot, (encounterDirectories) => {
    encounterDirectories.map(dir => {
      scanDirectory(path.join(encounterRoot, dir), (encounterFiles) => {
        encounterFiles
        .filter(file => file.endsWith('.json'))
        .map(file => {
          encounterPaths.push(path.join(dir, file.slice(0, -5)));
          console.log('pushing file', file);
        });
      });
    });
    // lol
    setTimeout(() => {
      callback(encounterPaths);
    }, 100);
  });
};

const getDirectoryAsync = async (path: string): Promise<string[]> => {
  let files;
  try {
    files = await readdir(path);
    // console.log(files);

  } catch (e) {
    console.log('getDirectoryAsync error', e);
  }

  return files;
};

interface IModuleStructure {
  [key: string]: string[];
}

export const getAllEncounters = async () => {
  const moduleRoot = path.join(__dirname, '..', 'public', 'modules');
  const encounters: IModuleStructure = {};

  return await getDirectoryAsync(moduleRoot).then(async result => {
    const modules = await result.map(async module => {
      const moduleFiles = await getDirectoryAsync(path.join(moduleRoot, module, 'encounters'));
      encounters[module] = moduleFiles
        .filter(file => file.endsWith('.json'))
        .map(file => file.slice(0, -5));
      return Promise.resolve();
    });

    await Promise.all(modules);
    return encounters;
  });
};

export const getEncounterKeys = (campaign: string, callback: (data: any) => void) => {
  const directoryPath = path.join(__dirname, '..', 'public', 'encounters', campaign);
  scanDirectory(directoryPath, (files: string[]) => {
    const encounters = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const encounterData = <string><unknown>fs.readFileSync(path.join(directoryPath, file));
      return JSON.parse(encounterData);
    });
    callback(encounters);
  });
};

export default {
  getEncounterKeys,
};
