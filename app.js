const express = require('express');
const run = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const convertXML = require('xml2js');
run.use(express.static('public'));
run.use(bodyParser.urlencoded({ extended: false }));
run.listen(5500, (req,res)=>{
    console.log( "**You're Connected at port : 5500")
})
const obj = {}

run.post('/getpath', async (req, res) =>{
    const p = req.body
    const m = req.body

    console.log(p,m)
})

run.post('/getapis', async (req,res)=>{
    const acc = req.body.accountCode
    const pass = req.body.password
    console.log(acc,pass)
    const asset_url = (`https://omi.zonarsystems.net/interface.php?customer=${acc}&username=zonar&password=${pass}&action=showopen&operation=showassets&format=xml`);
    const gps_url = (`https://omi.zonarsystems.net/interface.php?customer=${acc}&username=zonar&password=${pass}&action=showopen&operation=showgps&format=xml`);
    const location_url = (`https://omi.zonarsystems.net/interface.php?customer=${acc}&username=zonar&password=${pass}&action=showposition&operation=current&format=xml&version=2&logvers=3.6&customer=${acc}&startrow=0&count=1000&sortfield=lasttime&sortdir=asc`);
    const asset_res = await fetch(asset_url);
    const gps_res = await fetch(gps_url);
    const location_res = await fetch(location_url);
    const asset_data = await asset_res.text();
    //console.log(asset_data)
    const gps_data = await gps_res.text();
    const location_data = await location_res.text();

    convertXML.parseString(asset_data, {explicitArray:false}, function(err, data){
        obj['asset_DATA'] = data
        return obj
    })
    convertXML.parseString(gps_data, {explicitArray:false}, function(err, data){
        obj['gps_DATA'] = data
        return obj
    })
    convertXML.parseString(location_data, {explicitArray:false}, function(err, data){
        obj['location_DATA'] = data
        return obj
    })

    res.redirect('/home.html')
})

run.get('/dashboard', async (req, res)=>{
    console.log(obj)
    res.json(obj)
});
