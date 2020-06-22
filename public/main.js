const main_container = document.getElementById('main_container');
const b_container = document.getElementById('b_container');
const tabs_container = document.getElementById('asset_tab_container');
const asset_tab_content = document.getElementById('asset_tab_content');
//const tabLoader = document.getElementById('loader');
const main_ul = document.getElementById('main_ul');
//tabs_container.appendChild(tabLoader)
tabs_container.appendChild(main_ul)

async function runit() {
    const req = await fetch('dashboard');
    const allTheData = await req.json();

    const gpsAPI = allTheData.gps_DATA.gpslist.gps;
    const assetAPI = allTheData.asset_DATA.assetlist.asset;
    const locationAPI = allTheData.location_DATA.currentlocations.asset

    //console.log(locationAPI)
    const final = {}

    function mergeCalls(obj1, obj2, obj3) {
        let g = 0, x, y, z, gpsID, assetID, assetNo;
        obj1.map(i=>{
            assetID = i['$'].id
            gpsID = i.gps
            assetNo = i.fleet

            obj2.map(h=>{
                x = h['$'].sn
                if (h['$'].sn === gpsID) {
                    i['gpsdata'] = h
                }
                if (gpsID === '') {
                    i['gpsdata'] = 'empty'
                }
            })

            obj3.map(l=>{
                y = l['$'].id
                if (assetNo === l['$'].fleet) {
                    i['locationActivity'] = l
                }
                if (assetID === '' || gpsID === '' || i['locationActivity'] === undefined) {
                    i['locationActivity'] = 'empty'
                }
            })
        })
        //console.log(obj1)
        return obj1
    }

    // mergeCalls( assetAPI, gpsAPI, locationAPI ).map(j=>{
    //     //console.log(j)
    // })

    mergeCalls(assetAPI, gpsAPI, locationAPI).map(async (r)=>{
        const tab = document.createElement('li');
        const aTag = document.createElement('a');
        const assetSpan = document.createElement('span');
        tab.setAttribute('class', 'asset_tab');

        //console.log(r)
        const asset = r.fleet
          , gpsid = r.gps
          , idHandle = r['$'].id
          , phhm = r.gpsdata.lastcallhome
          , status = checkStatus(r)
          , firmware = r.gpsdata.firmware
          , lastinspdate = checkUndefinedINS(r)
          , speed = checkUndefinedSPD(r)
          , scid = r.gpsdata.scid;


        function checkUndefinedINS(h) {
            return h.gpsdata['$'] === undefined ? ':/' : h.gpsdata['$'].lastinspdate
        }

        function checkUndefinedSPD(h) {
            return h.locationActivity.speed === undefined ? ':/' : `${h.locationActivity.speed['_']} ${h.locationActivity.speed['$'].unit}`
        }

        function checkNaN(h) {
            let int = h.locationActivity.time
            return int === undefined ? 'NaN' : parseInt(r.locationActivity.time)
        }

        function covertEpochToTime(t) {
            let time
            if (t === 'NaN') {
                time = ':/'
            } else {
                let dt = new Date(t * 1000)
                  , m = dt.getMonth()
                  , day = dt.getDate()
                  , yr = dt.getFullYear()
                  , hr = dt.getHours()
                  , min = "0" + dt.getMinutes()
                  , s = "0" + dt.getSeconds();
                time = `${yr}-${m}-${day} ${hr}:${min.substr(-2)}:${s.substr(-2)}`;
            }
            return time
        }

        function checkStatus(h) {
            const inactiveIco = document.createElement('span');
            inactiveIco.setAttribute('class', 'inactiveIco');
            inactiveIco.textContent = 'i'

            const activeIco = document.createElement('span');
            activeIco.setAttribute('class', 'activeIco');
            activeIco.textContent = 'a'

            const sta = h.status == 1 ? aTag.appendChild(activeIco) : aTag.appendChild(inactiveIco);
            //console.log(sta)
            return sta
        }
        //console.log(covertEpochToTime(checkNaN(r)))
        assetSpan.textContent = asset
        main_ul.appendChild(tab);
        tab.appendChild(aTag)
        tab.setAttribute('data-set', idHandle)
        aTag.appendChild(assetSpan);
        aTag.setAttribute('href', `#id_${idHandle}`);

        let l_valuesArr = [gpsid, firmware, phhm, lastinspdate, scid];
        let l_keysArr = ['GPSID', 'Firmware', 'Last Phhm', 'Last inspection Date', 'SCID'];
        let r_valuesArr = [covertEpochToTime(checkNaN(r)), r.locationActivity.source, r.locationActivity.power, speed];
        let r_keysArr = ['Last Entry', 'Source', 'Power', 'Speed'];
        //console.log(covertEpochToTime(checkNaN(r)),r)
        //console.log(r.locationActivity)

        const asset_info = document.createElement('div');
        const div_left = document.createElement('div');
        const div_right = document.createElement('div');
        asset_info.setAttribute('class', 'data_tab_content');
        div_left.setAttribute('class', 'div_left');
        div_right.setAttribute('class', 'div_right');

        asset_info.setAttribute('id', `id_${idHandle}`);
        asset_info.setAttribute('data-path-data', idHandle)
        const h2 = document.createElement('h2');

        for (var i = 0; i < l_valuesArr.length; i++) {
            const keys = document.createElement('span');
            const values = document.createElement('span');
            keys.setAttribute('class', 'childof_div_left keys')
            values.setAttribute('class', 'childof_div_left values')


            keys.textContent = l_keysArr[i];
            values.textContent = l_valuesArr[i];
            div_left.appendChild(keys)
            div_left.appendChild(values)
        }

        for (var i = 0; i < r_valuesArr.length; i++) {
            const keys = document.createElement('span');
            const values = document.createElement('span');
            keys.setAttribute('class', 'childof_div_right keys')
            values.setAttribute('class', 'childof_div_right values')

            keys.textContent = r_keysArr[i];
            values.textContent = r_valuesArr[i];
            div_right.appendChild(keys)
            div_right.appendChild(values)
            //r_valuesArr[i]
        }

        asset_tab_content.appendChild(asset_info);
        asset_info.appendChild(h2);
        asset_info.appendChild(div_left);
        asset_info.appendChild(div_right);

        h2.textContent = " ASSET  : " + asset;

        //const handle = document.querySelectorAll('.data_tab_content');

        const tabLinks = new Array();
        const contentDivs = new Array();

        ////////////////////////////////////////
        async function showMePath(id_) {

            const table_div = document.createElement('div')
            table_div.setAttribute('id', `table_div ${idHandle}`)
            //const theId = closest('.asset_tab').getAttribute('data-set')

            console.log(table_div, idHandle)
            const p = allTheData.pass
            const ac = allTheData.acode
            const req = await fetch('getpath', {
                method: 'POST',
                body: JSON.stringify({
                    'item': idHandle,
                    'thepass': p,
                    'theaccount': ac
                }),
                headers: {'Content-Type': 'application/json'}
            })

            const fetch_path = await fetch('postpath')
            const parse_path = await fetch_path.json()
            const data = parse_path.path
            console.log(data)


            let totalColumns = Object.keys(data[0]).length;
            let columnNames = [];
            columnNames = Object.keys(data[0]);
            const table = document.createElement("TABLE");

            //Add the header row.
            let row = table.insertRow(-1);
            for (let i = 0; i < totalColumns; i++) {
                let headerCell = document.createElement("TH");
                headerCell.innerHTML = columnNames[i];
                row.appendChild(headerCell);
            }

            // Add the data rows.
            for (let i = 0; i < data.length; i++) {
                row = table.insertRow(-1);
                columnNames.forEach(function (columnName) {
                    let cell = row.insertCell(-1);
                    cell.innerHTML = data[i][columnName];
                });
            }

            //const dvTable = document.getElementById("dvTable");
            asset_tab_content.appendChild(table_div)
            table_div.innerHTML = "";
            table_div.appendChild(table);

            }
           // showMePath(idHandle)


        ///////////////////////////////////////
        function init() {
            const tabListItems = main_ul.childNodes;
            for (let i = 0; i < tabListItems.length; i++) {
                if (tabListItems[i].nodeName === 'LI') {
                    const tabLink = getFirstChildTagName(tabListItems[i], 'A');
                    const id = getHref(tabLink.getAttribute('href'))

                    tabLinks[id] = tabLink;
                    contentDivs[id] = document.getElementById(id);
                    //console.log(contentDivs[id],tabLinks[id] )
                    //console.log(id)
                }
            }

            let i = 0;
            for (id in tabLinks) {
                tabLinks[id].onclick = showContent;
                if (i == 0)
                    tabLinks[id].parentNode.classList.add('selected');
                //console.log(tabLinks[id].parentNode)
                i++
                //console.log(i)
                // console.log(tabLinks[id])
            }
            //console.log('frst :', i)

            i = 0;
            for (var id in contentDivs) {
                if (i != 0)
                    contentDivs[id].className = 'data_tab_content hide';
                i++;
            }
        }

        function showContent() {
            const selectedId = getHref(this.getAttribute('href'));
            const hId = this.parentNode.getAttribute('data-set');
            //console.log(hId)

            for (let id in contentDivs) {
                if (id == selectedId) {
                    tabLinks[id].parentNode.classList.add('selected');
                    contentDivs[id].className = 'data_tab_content';
                    //showMePath(hId);
                } else {
                    tabLinks[id].parentNode.classList.remove('selected');
                    contentDivs[id].className = 'data_tab_content hide';
                }

            }

            return false;
        }

        function getFirstChildTagName(element, tagName) {

            for (let i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].nodeName == tagName)
                    return element.childNodes[i];
            }
        }

        function getHref(url) {
            var hashPos = url.lastIndexOf('#');
            return url.substring(hashPos + 1);
        }

        init()
        //console.log(asset, status)
    }
    )


    search.addEventListener('keyup', e=>{
        e.preventDefault()
        const input = e.target.value.toLowerCase();
        const dataContent = document.querySelectorAll('.asset_tab');

        dataContent.forEach(i=>{
            const searchedItem = i.textContent.toLowerCase();
            if (searchedItem.indexOf(input) != -1) {
                //console.log(i)
                i.style.display = 'block';
            } else {
                i.style.display = 'none';
            }
        }
        )
    }
    )

}
runit()
