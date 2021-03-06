const express = require('express');
const run = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const convertXML = require('xml2js');
const port = process.env.port || 5500;
run.use(express.static('public'));
run.use(bodyParser.urlencoded({ extended: false }));
run.use(express.json())

run.listen(port, (req,res)=>{
    console.log( `**You're Connected at port : ${port}`)
})
const obj = {}
const the_path_data = {}


run.post('/getpath', async (req, res) =>{
    const p = req.body.item
    const account = req.body.theaccount
    const passwrd = req.body.thepass
    const gpsid = req.body.mani

    const epochTOtimeStart = () => {  // Midnight Epoch
        let t = new Date();
        t.setHours(0,0,0,0);
        return t.getTime() / 1000.0
    }

    const epochTOtimeEnd = () => {  // Midnight Epoch
        let t = new Date();
        t.setHours(23,59,0,0);
        return t.getTime() / 1000.0
    }


    const mani_url = (`https://omi.zonarsystems.net/gtc/interface.php?action=twentytwenty&username=zonar&password=${passwrd}&operation=getmanifest&format=json&gpssn=${gpsid}&customer=${account}&mobiledevicetypeid=2`)
    const path_url = (`https://omi.zonarsystems.net/interface.php?customer=${account}&username=zonar&password=${passwrd}&action=showposition&operation=path&reqtype=dbid&target=${p}&version=2&starttime=${epochTOtimeStart()}&endtime=${epochTOtimeEnd()}&logvers=3&format=json`)
    const path_req = await fetch(path_url).then(r=>r.json()).catch(err =>{ err})
    const mani_req = await fetch(mani_url).then(r=>r.json()).catch(err =>{err})
    //console.log(mani_req)
    // if (mani_req.error){
    //     console.log('NO MANI')
    // } else {
    //     console.log('MANI exits')
    // }

    path_req.pathevents.assets == null ? the_path_data['path'] = '404' : the_path_data['path'] = path_req.pathevents.assets[0].events;
    undefined || mani_req.error ? the_path_data['mani'] = '404' : the_path_data['mani'] = mani_req;



    res.json(the_path_data)
})


run.get('/postpath', async (req, res) =>{
    await res.json(the_path_data)
})


run.post('/getapis', async (req,res)=>{
    const acc = req.body.accountCode
    const pass = req.body.password
    obj['acode'] = acc
    obj['pass'] = pass
    //console.log(acc,pass)
    const asset_url = (`https://omi.zonarsystems.net/interface.php?customer=${acc}&username=zonar&password=${pass}&action=showopen&operation=showassets&format=xml`);
    const gps_url = (`https://omi.zonarsystems.net/interface.php?customer=${acc}&username=zonar&password=${pass}&action=showopen&operation=showgps&format=xml`);
    const location_url = (`https://omi.zonarsystems.net/interface.php?customer=${acc}&username=zonar&password=${pass}&action=showposition&operation=current&format=xml&version=2&logvers=3.6&customer=${acc}&startrow=0&count=1000&sortfield=lasttime&sortdir=asc`);
    const asset_res = await fetch(asset_url);
    const gps_res = await fetch(gps_url);
    const location_res = await fetch(location_url);
    const asset_data = await asset_res.text();
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

    if (obj.asset_DATA.error) {
        res.redirect('/')
    } else {
        res.redirect('/home.html')
    }
    //console.log(obj.asset_DATA.error)


})


run.get('/dashboard', async (req, res)=>{
    //console.log(obj)
    res.json(obj)
});
