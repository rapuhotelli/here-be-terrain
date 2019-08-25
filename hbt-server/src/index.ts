
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 8081;

const pubdir = (uri: string): string => (path.join(__dirname, '..', 'public', uri));

app.get( '/', ( req: Express.Request, res ) => {
  res.sendFile(pubdir('index.html'));
});

app.get('/levelselect', (req: Express.Request, res) => {
  const directoryPath = path.join(__dirname, '..', 'public', 'encounters', 'testcampaign');
  let encounters = [];
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }


    encounters = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const encounterData = <string><unknown>fs.readFileSync(path.join(directoryPath, file));
        return JSON.parse(encounterData);
      });

    res.send({
      data: encounters,
    });
  });
});

app.use(express.static('public'));

app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
});