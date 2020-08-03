const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.name, { lower: true }))
console.log(slugs);

const server = http.createServer((req, res) => {
  // const pathname = req.url;
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if(pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html'});
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el));
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } 
  // Product Page
  else if(pathname === '/product') {
    // console.log(query.id);
    res.writeHead(200, { 'Content-type': 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } 
  // Api Page
  else if(pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json'});
    res.end(dataObj);
  } 
  // Error Page
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world-header'
    });
    res.end('<h1>404 - Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});