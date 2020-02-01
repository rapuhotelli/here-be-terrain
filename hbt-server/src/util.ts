import fs from 'fs';
import os from 'os';
import path from 'path';
import util from 'util';


const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const scanDirectory = (directoryPath: string, callback: (fileList: string[]) => void) => {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    callback(files);
  });
};

export const getAllEncounterPaths = (callback: any) => {
  const encounterRoot = path.join(__dirname, '..', '..', '..', 'public', 'modules');
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
    files = files.filter(f => f !== '.DS_Store');

  } catch (e) {
    console.log('getDirectoryAsync error', e);
  }

  return files;
};

interface IModuleStructure {
  [key: string]: string[];
}

export const getAllEncounters = async () => {
  const moduleRoot = path.join(__dirname, '..', '..', '..', 'public', 'modules');
  const encounters: IModuleStructure = {};

  return getDirectoryAsync(moduleRoot).then(async result => {
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

export const getEncounterData = async (campaign: string, encounter: string) => {
  const filePath = path.join(__dirname, '..', '..', '..', 'public', 'modules', campaign, 'encounters', `${encounter}.json`);
  const filecontent = await readFile(filePath, 'utf8');
  return JSON.parse(filecontent);
};

export const getIp = () => {
  const ifs = Object.values(os.networkInterfaces());
  const flat = [].concat(...ifs).filter(f => f.family === 'IPv4' && f.internal === false);
  return flat[0].address;
};

export const getPlayerGroups = async () => {
  const playersFolder = path.join(__dirname, '..', '..', '..', 'public', 'players');
  const groups = await readdir(playersFolder);
  const groupsData = await Promise.all(groups.map(getPlayerGroup));
  return groupsData;
};

async function getPlayerGroup(groupFileName: string) {
  const groupFile = path.join(__dirname, '..', '..', '..', 'public', 'players', groupFileName);
  const fileContent = await readFile(groupFile, 'utf8');
  return JSON.parse(fileContent);
}
