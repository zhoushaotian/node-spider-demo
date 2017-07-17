# 一个node爬虫demo  
用到的包：
- superagent:用来发起http请求  
- cheerio：解析爬到的html文档 并用jquery的形式查询dom 
- url：node自带的模块用来拼接URL
- express:node web框架  
简单爬取了cnode的内容 由于有连接限制，一次发起的请求不能太多。用到了promise控制异步并发。