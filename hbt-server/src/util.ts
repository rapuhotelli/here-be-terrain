import fs from 'fs';
import path from 'path';

const scanDirectory = (directoryPath: string, callback: (fileList: string[]) => void) => {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    callback(files);
  });
};

export const getAllEncounterPaths = (callback: any) => {
  const encounterRoot = path.join(__dirname, '..', 'public', 'encounters');
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
