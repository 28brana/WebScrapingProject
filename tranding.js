const cheerio= require('cheerio');
const puppeteer=require('puppeteer');
const url='https://www.youtube.com/feed/trending';
(async ()=>{
    try{
        const browser=await puppeteer.launch({headless:false,defaultViewport:false,args:['--start-maximized']})

        const page=await browser.newPage();
        await page.goto(url);
        await  page.waitForSelector('#contents ytd-video-renderer');

        let htmlArr=await page.evaluate(()=>{
            let contentArr=document.querySelectorAll('#contents ytd-video-renderer');
            let htmlArr=[];
            for(let i=0;i<contentArr.length;i++){
                let innerHtml=contentArr[i].innerHTML;
                htmlArr.push(innerHtml);
            }
            return htmlArr;
        })

        handleHtml(htmlArr);
        
    }catch(err){
        console.log(err);
    }
})();


function handleHtml(htmlArr){
    for(let i=0;i<htmlArr.length;i++){
        extractData(htmlArr[i])
    }
}

function extractData(html){
    let $ = cheerio.load(html);
    let title=$($('#video-title yt-formatted-string')[0]).text();

    let channelTag=$('#meta ytd-video-meta-block .yt-simple-endpoint');
    let channelName=$(channelTag[0]).text();
    let channelUrl=$(channelTag[0]).attr('href');
    channelUrl=`https://www.youtube.com${channelUrl}`;
    let viewsAndDateTag=$('#meta #metadata-line span');
    let views=$(viewsAndDateTag[0]).text();
    let uploadTime=$(viewsAndDateTag[1]).text();
    let videoLink=$($(' #thumbnail')[0]).attr('href');
    videoLink=`https://www.youtube.com${videoLink}`;
    
    let obj={
        title,channelName,channelUrl,views,uploadTime,videoLink
    }
    console.log(obj)

    

}
