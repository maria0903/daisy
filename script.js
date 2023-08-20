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

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function changeLanguage(language) {
    document.documentElement.lang = language.toLowerCase();

    const allLanguageElemList = document.querySelectorAll(`*[data-i18n]`);

    allLanguageElemList.forEach(x => {
        x.style.cssText = 'display: none !important;';
    })

    console.log(language);

    const selectedLanguageElemList = document.querySelectorAll(`*[data-i18n="${language}"]`);

    selectedLanguageElemList.forEach(x => {
        x.style.cssText = 'display: flex;';

        console.log(x, x.style);
    })

}
