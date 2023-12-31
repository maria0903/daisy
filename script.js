const urlScheme = 'https://travel-danger.vercel.app';
const urlSchemeDev = 'http://localhost:3001';
const apiUrlScheme = 'https://travel-danger.vercel.app/api';
const apiUrlSchemeDev = 'http://localhost:3001/api';
const safeMapUrl = '/safeMap/v1/list';
const hotNewsUrl = '/news/v1/list';
const policeInfoUrl = '/police/v1/list';
const threatMapUrl = '/map/v1';
const shelterMapUrl = '/shelter/v1'
const reportUrl = '/report';
const reportListUrl = '/report/list';

let locale = 'en';

const titleMatchThreat = {
    en: 'Daisy',
    ja: 'デージー',
    cn: '雏菊',
    ko: '데이지',
    vi: 'Hoa cúc'
}

const titleMatchShelter = {
    en: 'Daisy - Shelter',
    ja: 'デージー - 待避所',
    cn: '雏菊 - 避难所',
    ko: '데이지 - 대피소',
    vi: 'Hoa cúc - nơi lẩn tránh'
}

async function main() {
    const href = document.location.href;

    setLocale();

    if (href.includes('police')) {
        setPoliceInfoElement();
    }
}

function setLocale () {
    const currentLanguage = getLanguage();

    if (currentLanguage) {
        changeLanguage(currentLanguage.split('-')[0], true);
    }
}

async function submitReport (e) {
    const elems = document.getElementsByClassName('report-content');

    let content;
    for (const elem of elems) {
        if (elem.value) {
            content = elem.value;

            elem.value = '';

            break;
        }
    }

    if (!content || content.length === 0) {
        return;
    }

    const { result } = await fetchUrl(apiUrlScheme + reportUrl, { method: 'POST', body: JSON.stringify({ content }) });

    if (result === 'SUCCESS') {
        const myToast = Toastify({
            text: "Thank you☺️",
            duration: 3500
        });

        myToast.showToast();
    }
}

function search (e) {
    const iframe = document.getElementById('ThreatMap');

    iframe.src = urlScheme + threatMapUrl + `?locale=${locale}&q=${e.value}`;
}


function openNav() {
    document.getElementById("mySidenav").style.width = "180px";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

async function changeLanguage(language, noFetch) {
    const isShelter = location.href.includes('shelter');
    const iframeUrl = isShelter ? shelterMapUrl : threatMapUrl;
    const iframeId = isShelter ? 'ShelterMap' : 'ThreatMap';

    document.documentElement.lang = language.toLowerCase();

    localStorage.setItem('language', language.toLowerCase());

    if (isShelter) {
        document.title = titleMatchShelter[language.toLowerCase()];
    } else {
        document.title = titleMatchThreat[language.toLowerCase()];
    }

    locale = language.toLowerCase();

    try {
        const iframe = document.getElementById(iframeId);

        iframe.src = `${urlScheme}${iframeUrl}?locale=${language.toLowerCase()}`
    } catch (e) {
        console.log(e);
    }


    const allLanguageElemList = document.querySelectorAll(`*[data-i18n]`);

    allLanguageElemList.forEach(x => {
        x.style.cssText = 'display: none !important;';
    })

    const selectedLanguageElemList = document.querySelectorAll(`*[data-i18n="${language}"]`);

    selectedLanguageElemList.forEach(x => {
        if (x.tagName === 'TABLE') {
            x.style.cssText = 'display: table;';
        } else if (x.tagName === 'P' || x.tagName === 'RUBY') {
            x.style.cssText = 'display: block;';
        } else {
            x.style.cssText = 'display: flex;';
        }
    });



    if (!noFetch && !isShelter) {
        setHotNewsElement(language.toLowerCase());
        setReportList();
    }
}

function getLanguage() {
    const localStorageLanguage = localStorage.getItem('language');

    if (localStorageLanguage) {
        return localStorageLanguage;
    }
    return navigator.language || navigator.userLanguage;
}


/** 안전한 지역 불러오기 */

async function fetchUrl(url, options = {}) {
    return await fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}

async function setHotNewsElement (language) {
    const hotNewsAreaElem = document.getElementById('hot-news-area');

    hotNewsAreaElem.innerHTML = `
         <div class="loadingio-spinner-eclipse-7619zybbhb">
             <div class="ldio-wofmlj1rnkd">
                 <div></div>
             </div>
         </div>
    `;

    const data = {
        method: 'POST',
        body: JSON.stringify({
            language: language || getLanguage().split('-')[0]
        })
    };
    const hotNewsData = await fetchUrl(apiUrlScheme + hotNewsUrl, data);

    if (hotNewsData.length) {
        hotNewsAreaElem.innerHTML = '';

        hotNewsData.forEach((x, idx) => {
            const htmlSectionElement = document.createElement('section');

            if (idx % 2) {
                htmlSectionElement.style = `
                      border-radius: 3px;
                      overflow: hidden;
                      background: #e6f4f4eb;
                `;
            } else {
                htmlSectionElement.style = `
                      border-radius: 3px;
                      overflow: hidden;
                      background: #ade3e5e4;
                `;
            }

            htmlSectionElement.classList = ['additional-row'];
            htmlSectionElement.ariaRowIndex = idx + 1;
            htmlSectionElement.ariaLabel = x.desc;
            htmlSectionElement.ariaHasPopup = "true";
                htmlSectionElement.innerHTML = `
                <a href="${x.url}">
                    <h6 class="additional-title">${idx + 1}. ${x.title}</h6>
                    <div class="flex gap-1 pt-1 justify-space-between">
                        <p class="additional-desc">${x.description}</p>
                        <img class="additional-img" src="${x.img_url}" alt="${x.title}"></img>
                    </div>
                </a>
                `;

            hotNewsAreaElem.appendChild(htmlSectionElement);
        });
    }
}

async function setReportList (language) {
    const reportListAreaElem = document.getElementById('report-list-area');

    reportListAreaElem.innerHTML = `
         <div class="loadingio-spinner-eclipse-7619zybbhb">
             <div class="ldio-wofmlj1rnkd">
                 <div></div>
             </div>
         </div>
    `;

    const data = {
        method: 'POST',
        body: JSON.stringify({
            language: language || getLanguage().split('-')[0]
        })
    };
    const reportListData = await fetchUrl(apiUrlScheme + reportListUrl, data);

    console.log(reportListData);

    if (reportListData.result.length) {
        reportListAreaElem.innerHTML = '';

        reportListData.result.forEach((x, idx) => {
            const htmlSectionElement = document.createElement('section');

            if (idx % 2) {
                htmlSectionElement.style = `
                      border-radius: 3px;
                      overflow: hidden;
                      background: #e6f4f4eb;
                `;
            } else {
                htmlSectionElement.style = `
                      border-radius: 3px;
                      overflow: hidden;
                      background: #ade3e5e4;
                `;
            }

            htmlSectionElement.classList = ['additional-row'];
            htmlSectionElement.ariaRowIndex = idx + 1;
            htmlSectionElement.ariaLabel = x.desc;
            htmlSectionElement.ariaHasPopup = "true";
                htmlSectionElement.innerHTML = `
                <a href="${x.url}">
                    <h6 class="additional-title-2">${idx + 1}. ${x.content}</h6>
                    <div class="flex gap-1 pt-1 justify-space-between">
                        <p class="additional-desc-2">${x.created_at}</p>
                    </div>
                </a>
                `;

            reportListAreaElem.appendChild(htmlSectionElement);
        });
    }
}

async function setPoliceInfoElement () {
    const policeInfoData = await fetchUrl(apiUrlScheme + policeInfoUrl);

    if (Object.keys(policeInfoData).length) {
        const policeInfoAreaElem = document.getElementById('police-info');

        Object.entries(policeInfoData).forEach(([key, val]) => {
            const htmlDivElement = document.createElement('div');

            htmlDivElement.classList = ['col-6'];
            htmlDivElement.ariaValueText = key;
            htmlDivElement.innerHTML = `
                <div>
                    <p class="police-capital">${key}</p>
                    <table>
                        <tr>
                            <th>관서</th>
                            <th>주소</th>
                            <th>홈페이지</th>
                        </tr>
                        ${
                            val.map(data => `<tr>
                                <td>${data.capital}</td>
                                <td>${data.address}</td>
                                <td>${data.url}</td>
                            </tr>`.replace(',', ''))
                        }
                    </table>
                </div>
            `;

            policeInfoAreaElem.appendChild(htmlDivElement);
        })
    }
}

// document ready
document.addEventListener("DOMContentLoaded", function () {
    main();

    const isShelter = location.href.includes('shelter');

    if (isShelter) {
        document.getElementById('ShelterMap').style.height = `calc(70vh + ${document.documentElement.clientHeight / 15}px)`;
    } else {
        document.getElementById('ThreatMap').style.height = `calc(40vh + ${document.documentElement.clientHeight / 15}px)`;
    }
});
