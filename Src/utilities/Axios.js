const axios  = require('axios')

const AxiosForIpadress = axios.create({
    // baseURL: "https://ip.seeip.org?format=jsonp&callback=getIP",
    baseURL: "https://worldtimeapi.org/api/ip",
  });
  
const AxiosForJobSearch = axios.create({
    baseURL: "https://api.whatjobs.com/api/v1/jobs.json?publisher=3785&user_ip=100.8.240.174",
  });

module.exports = {AxiosForIpadress, AxiosForJobSearch}