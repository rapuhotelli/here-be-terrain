import fs from 'fs';
import path from 'path';
import util from 'util';

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);


const pathToObject = (path: string) => {
  const [module, encounter] = path.substring(1).split('/');

};

export function recFind(base: string, search: string, files?: string[], result?: string[])
{
  files = files || fs.readdirSync(base);
  result = result || [];

  files.forEach(
    function (file) {
      var newbase = path.join(base,file);
      if ( fs.statSync(newbase).isDirectory() )
      {
        result = recFind(newbase, search, fs.readdirSync(newbase),result);
      }
      else
      {
        // if ( file.substr(-1*(ext.length+1)) === '.' + ext )
        if (file === search)
        {
          result.push(newbase);
        }
      }
    },
  );
  return result;
}
