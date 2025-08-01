const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////////////////////
// FILES:
/*
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textout = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;

fs.writeFileSync('./txt/output.txt', textout);

console.log('File written');

Non-blocking ,asynchronous
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log("ERROR !!");
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {
                console.log('Your file has been written');
            });
        });
    })
});
console.log('Will read file!'); 
*/

////////////////////////////////////////
// SERVER:

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }
  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  }
  //Not found
  else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      myOwnHeader: 'hello world',
    });
    res.end('<h1>Page not found</h1>');
  }
});
server.listen(8000, '0.0.0.0', () => {
  console.log('Listening to requests on port 8000');
});
