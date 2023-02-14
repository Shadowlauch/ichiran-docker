import express from 'express';
import {execSync} from 'child_process';
import cors from 'cors';

export const segment = (text: string) => {
  try {
    return JSON.parse(execSync(`cd /root/quicklisp/local-projects/ichiran/ && ./ichiran-cli -f -- "${text}"`).toString());
  } catch (e) {
    return [];
  }
}

(async () => {
  //await build();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.post('/segmentation', (req, res) => {
    if (req.body.text && req.body.text.length > 0) {
      res.json(segment(req.body.text));
    } else {
      res.status(500);
      res.send();
    }
  });

  app.listen(80, () => {
    console.log('Started server');
  })
})();




