const axios = require('axios'); 
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const CONF_PAGE_BASE = 'https://belchip.by/section/?selected_section=%D0%A3%D0%A2-00000644&limit=120&page=';
const PAGE_COUNT = 6;

function parseDevice(deviceEl) {
    const parsedDevice = {
        'name': deviceEl.querySelector(".device__name > a").textContent.trim().split("  ").join(""),
        'manufacturer':deviceEl.querySelector(".device__name > div").textContent,
        'price':deviceEl.querySelector(".device__price").textContent,
        'image':deviceEl.querySelector(".device__image > a > img").src,
    };

    console.log(parsedDevice)

    return parsedDevice;
}


async function parsePage(pageUrl, pageIndex) {
    const response = await axios.get(`${pageUrl}${pageIndex}`);
       
    const html = response.data;
    const dom = new JSDOM(html);
    let deviceElArray = dom.window.document.querySelectorAll('.device');

    let deviceDataArray = [];

    for (const deviceEl of deviceElArray) {
        deviceDataArray.push(parseDevice(deviceEl));
    }

    return deviceDataArray;
}


async function parseSection() {
    let resualtArray = []

    for (let index = 0; index < PAGE_COUNT; index++) {
        const r = await parsePage(CONF_PAGE_BASE, 1)
        resualtArray.push(r)
    }

    console.log(resualtArray)
    return resualtArray;
}


/// пока не работает 
var fs = require('fs');
fs.writeFile("test.json", JSON.stringify({"devices" : await parseSection()}), function(err) {
    if (err) {
        console.log(err);
    }
});