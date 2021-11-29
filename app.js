const fs = require("fs");
const http = require("http")
var requests = require("requests");


let indexFile = fs.readFileSync("index.html" , "utf-8")

const realtimeData = ({temp, name, temp_min, temp_max, country} , file)=>{
      
      let values = file.replace("{%tempval%}" , temp)
      values = values.replace("{%location%}" , name)
      values = values.replace("{%country%}" , country)
      values = values.replace("{%tempmin%}" , temp_min)
      values = values.replace("{%tempmax%}" , temp_max)
      
      return values
}

const server = http.createServer((req,res) => {
    if(req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Jaipur&units=metric&appid=6e59b47e7e8a658ade90cbbcea04e36d")
            .on('data' , (chunk) =>{
                const objData = JSON.parse(chunk)
                console.log(objData);
                const { main, sys, name } = objData
                const { temp, temp_min, temp_max } = main
                const { country } = sys
                let structuredData = {
                    temp, name, temp_min, temp_max, country    
                }
                console.log(structuredData)
                let updatedRealtimeData =realtimeData(structuredData , indexFile)
                res.write(updatedRealtimeData)
               
            })
            .on('end' , (err) =>{
                // console.log(err);
                res.end()
            })
    }   
})

server.listen(8000, "127.0.0.1" ,()=>{
    console.log("server created");
})