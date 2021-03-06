const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data.json`,'utf-8');
const Data = JSON.parse(json)
console.log(Data);

const server = http.createServer((req,res) => {
const pathName = url.parse(req.url,true).pathname;
const id = url.parse(req.url,true).query.id;
console.log(url.parse(req.url,true).query);


    // Product Overview
    if(pathName === '/products' || pathName === '/')
    {
        res.writeHead(200,{'Content-type':'text/html'});

        fs.readFile(`${__dirname}/templates/template-overview.html`,'utf-8',(err,data)=>{
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`,'utf-8',(err,data)=>{

                const cardOutput = Data.map(el=> replaceTemplate(data,el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}',cardOutput);
                res.end(overviewOutput);
            });
        });
    }

    // Laptop detail
    else if(pathName === '/laptop' && id < Data.length)
    {
        res.writeHead(200,{'Content-type':'text/html'});

        fs.readFile(`${__dirname}/templates/template-laptop.html`,'utf-8',(err,data)=>{

            const laptop = Data[id];
            const output = replaceTemplate(data,laptop);
            res.end(output);
        });
    }
    // Images
    else if((/\.(jpg|jpeg|gif|png)$/i).test(pathName))
    {
        fs.readFile(`${__dirname}/img${pathName}`,(err,data)=>{
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(data);
        })
    }
    // URL not found
    else
    {
        res.writeHead(404,{'Content-type':'text/html'});
        res.end('URL not found on the server');
    }
    
});
server.listen(1337,'127.0.0.1',() => {
    console.log('Listening the server now');
})


function replaceTemplate(originalHtml, laptop)
{
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g,laptop.productName);
    output = output.replace(/{%IMAGE%}/g,laptop.image);
    output = output.replace(/{%PRICE%}/g,laptop.price);
    output = output.replace(/{%SCREEN%}/g,laptop.screen);
    output = output.replace(/{%CPU%}/g,laptop.cpu);
    output = output.replace(/{%STORAGE%}/g,laptop.storage);
    output = output.replace(/{%RAM%}/g,laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g,laptop.description);
    output = output.replace(/{%ID%}/g,laptop.id);
    return output;
}