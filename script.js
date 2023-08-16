const Http = new XMLHttpRequest();
const safeMapUrl = 'http://localhost:3001/api/safeMap/v1/list';

async function main() {
    await getSafeMapData();
    console.log(1);
}

/** 안전한 지역 불러오기 */
async function getSafeMapData() {
    await Http.open('POST', safeMapUrl);
    await Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.responseText) {
            const datas = JSON.parse(Http.responseText);
        }
    };

    console.log(document);
}

main();