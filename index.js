const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');
const url = require('url');

const app = express();
const cnodeUrl = 'http://cnodejs.org/';
app.get('/', (req, res, next) => {
    superagent.get('http://cnodejs.org').end((err, sres) => {
        if (err) {
            return next(err);
        }
        let $ = cheerio.load(sres.text);
        let item = [];
        $('#topic_list .topic_title').each((index, ele) => {
            let $ele = $(ele);
            item.push({
                title: $ele.attr('title'),
                href: url.resolve(cnodeUrl, $ele.attr('href'))
            });
        });
        $('#topic_list .user_avatar img').each((index, ele) => {
            let $ele = $(ele);
            item[index].autor = $ele.attr('title');
        });
        //开始对每篇文章爬取内容
        let reqArr = [];
        /*
        item.forEach((ele) => {
            reqArr.push(superagent('GET', ele.href));
        });
        */
        reqArr.push(superagent('GET', item[0].href));
        reqArr.push(superagent('GET', item[1].href));
        reqArr.push(superagent('GET', item[2].href));

        Promise.all(reqArr).then((pres) => {
            let $0 = cheerio.load(pres[0].text);
            let $1 = cheerio.load(pres[1].text);
            let $2 = cheerio.load(pres[2].text);
            item[0].comment1 = $0('.reply_content ').eq(0).text();
            item[1].comment1 = $1('.reply_content ').eq(0).text();
            item[2].comment1 = $2('.reply_content ').eq(0).text();
            res.send(item);
        }).catch((perr) => {
            console.log(perr);
        });

    })
});

app.listen(3000);