const main_container = document.getElementById('main_container');
const b_container = document.getElementById('b_container');
const tabs_container = document.getElementById('asset_tab_container');
const asset_tab_content = document.getElementById('asset_tab_content');
const switch_account = document.getElementById('changeacc');
const switch_input = document.getElementById('switch_acc');
const main_ul = document.getElementById('main_ul');
tabs_container.appendChild(main_ul)


async function runit() {
    const req = await fetch('dashboard');
    const allTheData = await req.json();

    const gpsAPI = allTheData.gps_DATA.gpslist.gps;
    const assetAPI = allTheData.asset_DATA.assetlist.asset;
    const locationAPI = allTheData.location_DATA.currentlocations.asset


    switch_account.textContent = allTheData.acode
    //console.log(switch_account,allTheData)
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
        return obj1
    }


    switch_account.textContent = allTheData.acode.toUpperCase();
    document.title = `Viewing ${allTheData.acode}`;

    mergeCalls(assetAPI, gpsAPI, locationAPI).map(async (r)=>{
        const tab = document.createElement('li');
        const aTag = document.createElement('a');
        const assetSpan = document.createElement('span');
        tab.setAttribute('class', 'asset_tab');


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
            return int == undefined || int == '' ? 'NaN' : parseInt(r.locationActivity.time)
        }

        function covertEpochToTime(t) {
            let time
            if (t == 'NaN') {
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
            return sta
        }


        tab.setAttribute('data-path', idHandle);
        assetSpan.textContent = asset
        main_ul.appendChild(tab);
        tab.appendChild(aTag)
        tab.setAttribute('data-set', idHandle)
        aTag.appendChild(assetSpan);
        aTag.setAttribute('href', `#id_${idHandle}`);

        let l_valuesArr = [gpsid, firmware, phhm, lastinspdate, scid, covertEpochToTime(checkNaN(r)), r.locationActivity.source, r.locationActivity.power, speed];
        let l_keysArr = ['GPSID', 'Firmware', 'Last Phhm', 'Last inspection Date', 'SCID', 'Last Entry', 'Source', 'Power', 'Speed'];


        const asset_info = document.createElement('div');
        const div_left = document.createElement('div');
        asset_info.setAttribute('class', 'data_tab_content');
        div_left.setAttribute('class', 'div_left');


        asset_info.setAttribute('id', `id_${idHandle}`);
        asset_info.setAttribute('data-path-data', idHandle)
        const h2 = document.createElement('h2');
        h2.setAttribute('class', 'top_header');


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


        asset_tab_content.appendChild(asset_info);
        asset_info.appendChild(h2);
        asset_info.appendChild(div_left);

        h2.textContent = " ASSET  : " + asset;


        const tabLinks = new Array();
        const contentDivs = new Array();

        ///////////////////////////////////////
        function init() {
            const tabListItems = main_ul.childNodes;
            for (let i = 0; i < tabListItems.length; i++) {
                if (tabListItems[i].nodeName === 'LI') {
                    const tabLink = getFirstChildTagName(tabListItems[i], 'A');
                    const id = getHref(tabLink.getAttribute('href'))

                    tabLinks[id] = tabLink;
                    contentDivs[id] = document.getElementById(id);
                }
            }

            let i = 0;
            for (id in tabLinks) {
                tabLinks[id].onclick = showContent;
                if (i == 0)
                    tabLinks[id].parentNode.classList.add('selected');
                i++
            }

            i = 0;
            for (var id in contentDivs) {
                if (i != 0)
                    contentDivs[id].className = 'data_tab_content hide';
                i++;
            }
        }

        function showContent() {
            const selectedId = getHref(this.getAttribute('href'));
            const path_id = this.parentNode.getAttribute('data-path')


            for (let id in contentDivs) {
                if (id == selectedId) {
                    tabLinks[id].parentNode.classList.add('selected');
                    contentDivs[id].className = 'data_tab_content';

                    const thepgsid = contentDivs[id].childNodes[1].childNodes[1].innerHTML

                    function isgpsEmpty(){

                        return thepgsid =='' ? 0 : thepgsid
                    }


                    if (document.getElementById(`table_div_${path_id}`) ){
                        console.log('it exits')
                    }else{
                        console.log('No div found')
                        showMePath(path_id, contentDivs[id], isgpsEmpty())
                    }
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
            //////////////////////////////// THE PATH ///////////////////////////////////

            async function showMePath(id_, parentDiv, mani) {

                const table_div = document.createElement('div')
                table_div.setAttribute('id', `table_div_${id_}`)
                table_div.setAttribute('data-check', id_)
                table_div.setAttribute('class', 'table_div')


                const p = allTheData.pass
                const ac = allTheData.acode
                const req = await fetch('getpath', {
                    method: 'POST',
                    body: JSON.stringify({
                        'item': id_,
                        'mani': mani,
                        'thepass': p,
                        'theaccount': ac,
                    }),
                    headers: {'Content-Type': 'application/json'}
                })

                const fetch_path = await fetch('postpath')
                const parse_the_data = await fetch_path.json()

                const data = parse_the_data.path
                const maniData = parse_the_data.mani

                if ( maniData == 404 )
                {
                    const mani_oops = document.createElement('div');
                    const mani_p = document.createElement('p');
                    const div_right = document.createElement('div');
                    div_right.setAttribute('class', 'div_right_oops content_divs');
                    mani_oops.setAttribute('class', 'mani_oops')
                    mani_p.textContent = 'No data to show here'
                    div_right.appendChild(mani_oops);
                    mani_oops.appendChild(mani_p);
                    parentDiv.appendChild(div_right);
                    console.log('MANI dont exist')

                }else
                {
                    const div_right = document.createElement('div');
                    div_right.setAttribute('class', 'div_right content_divs');
                    let apps_arr = maniData.packageManifest.apps;


                    const mani_details_apps = document.createElement('details')
                    const mani_summary_apps = document.createElement('summary')
                    mani_summary_apps.textContent = 'Apps'
                    for (var i = 1; i < apps_arr.length; i++) {
                        const mani_s = document.createElement('p')

                        mani_s.textContent = `${apps_arr[i].label} (${apps_arr[i].availableVersionCode})`
                        mani_details_apps.appendChild(mani_s);
                    }

                    mani_details_apps.appendChild(mani_summary_apps);
                    parentDiv.appendChild(div_right);

                    const title_handles = ['Tablet Firmware (Build No.)', 'Screen off in motion', 'Clear Cache', 'Auto Lougout', 'Audio off W/Motion'];
                    const title_value = [maniData.firmware.buildNumber, apps_arr[0].settings.screenOffInMotion, `${apps_arr[0].settings.profileCacheTtlDays} days`, `${apps_arr[0].settings.autoLogoutTtlSecs} Seconds`, apps_arr[0].settings.audioOffInMotion]
                    for (let i = 0; i < title_handles.length; i++) {
                        const th_span = document.createElement('span');
                        const tv_span = document.createElement('span');
                        th_span.setAttribute('class', 'th_span');
                        tv_span.setAttribute('class', 'tv_span values');


                        th_span.textContent = title_handles[i];
                        tv_span.textContent = title_value[i];
                        div_right.appendChild(th_span);
                        div_right.appendChild(tv_span);


                    }
                    div_right.appendChild(mani_details_apps);
                }

                if ( data == 404)
                {
                    //console.log('well this is awkward -_-')
                    const oops = document.createElement('div');
                    oops.setAttribute('class', 'oops_div content_divs')
                    const oops_span = document.createElement('span');

                    oops_span.textContent = 'There is no path data to show';
                    parentDiv.appendChild(oops);
                    oops.appendChild(table_div);
                    table_div.appendChild(oops_span);

                }else
                {
                    let totalColumns = Object.keys(data[0]).length - 4;
                    let columnNames = [];
                    columnNames = Object.keys(data[0]);
                    const table = document.createElement("TABLE");

                    //Add the header row.
                    columnNames.splice(9)
                    columnNames.splice(7, 1)
                    //console.log(columnNames)
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
                    parentDiv.appendChild(table_div)
                    table_div.innerHTML = "";
                    table_div.appendChild(table);
                    //console.log(parentDiv, table_div)
                }
            }
            //////////////////////////////// PATH AND MANI END ////////////////////////////////
    })


    function changeAcount () {
        const main_modal = document.createElement('div')
        const modal_div = document.createElement('div')
        const m_form = document.createElement('form')
        const m_input = document.createElement('input')
        const m_span = document.createElement('span')
        m_form.setAttribute('id', 'switch_acc')
        m_input.setAttribute('id', 'switch_account_code')
        m_input.setAttribute('placeholder', 'Enter account code')
        modal_div.setAttribute('class', 'modal-content')
        main_modal.setAttribute('id', 'modal')

        main_modal.appendChild(modal_div)
        modal_div.appendChild(m_form)
        m_form.appendChild(m_input)
        main_container.appendChild(main_modal)
        modal_div.appendChild(m_span)
        //m_span.textContent = 'x'

        // switch_account.onclick = ()=> {
        //     main_modal.style.display = "block";
        // }
        window.onclick = function(event) {
            if (event.target == main_modal) {
                main_modal.style.display = "none";
            }
        }


        m_form.addEventListener('submit', async (e)=>{
            const acc_input = document.getElementById('switch_account_code').value
            const sub_spin = document.createElement('i')
            sub_spin.setAttribute('class', 'fa fa-spinner fa-spin')
            e.preventDefault();
            const switch_req = await fetch('getapis', {
                method: 'POST',
                body: JSON.stringify({
                    'password': allTheData.pass,
                    'accountCode': acc_input,
                }),
                headers: {'Content-Type': 'application/json'}
            })
            //console.log('submited!', acc_input)
            setTimeout(location.reload(),3000)
            document.getElementById('changeacc').appendChild(sub_spin)

        })

    }


    switch_account.addEventListener('click', e => {
        changeAcount()
        document.getElementById('modal').style.display = "block";

    })


    search.addEventListener('keyup', e=>{
        e.preventDefault()
        const input = e.target.value.toLowerCase();
        const dataContent = document.querySelectorAll('.asset_tab');

        dataContent.forEach(i=>{
            const searchedItem = i.textContent.toLowerCase();
            if (searchedItem.indexOf(input) != -1) {
                i.style.display = 'block';
            } else {
                i.style.display = 'none';
            }
        })
    })

}
runit()
