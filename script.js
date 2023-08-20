const Http = new XMLHttpRequest();

const languageList = [
    {
        "txt": "English",
        "img": "국기/UN.jpg",
        "val": "en"
    },
    {
        "txt": "日本語",
        "img": "국기/Japan.jpg",
        "val": "ja"
    },
    {
        "txt": "한국어",
        "img": "국기/Korean.jpg",
        "val": "ko"
    },
    {
        "txt": "汉语",
        "img": "국기/China.jpg",
        "val": "cn"
    },
    {
        "txt": "Tiếng Việt",
        "img": "국기/Vietnam.jpg",
        "val": "vi"
    }
];
const languageSelectId = 'sel2';

async function main() {
    setLocale();
    setHotNewsElement();
    const safeMapData = await fetchUrl(apiUrlScheme + safeMapUrl);
}

function setLocale () {
    const currentLanguage = getLanguage();

    if (currentLanguage) {
        changeLanguage(currentLanguage.split('-')[0]);
    }
}


function openNav() {
    document.getElementById("mySidenav").style.width = "180px";
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

    const selectedLanguageElemList = document.querySelectorAll(`*[data-i18n="${language}"]`);

    selectedLanguageElemList.forEach(x => {
        x.style.cssText = 'display: flex;';

        console.log(x, x.style);
    })

}

function getLanguage() {
    return navigator.language || navigator.userLanguage;
}

const apiUrlScheme = 'https://travel-danger.vercel.app/api';
const apiUrlSchemeDev = 'http://localhost:3001/api';
const safeMapUrl = '/safeMap/v1/list';
const hotNewsUrl = '/news/v1/list';

/** 안전한 지역 불러오기 */

async function fetchUrl(url, options = {}) {
    return await fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}

async function setHotNewsElement () {
    const data = {
        method: 'POST',
        body: JSON.stringify({
            keyword: '살인'
        })
    };
    const hotNewsData = await fetchUrl(apiUrlSchemeDev + hotNewsUrl, data);

    if (hotNewsData.length) {
        const hotNewsAreaElem = document.getElementById('hot-news-area');

        hotNewsData.forEach((x, idx) => {
            const htmlDivElement = document.createElement('div');

            htmlDivElement.classList = ['additional-row'];
            htmlDivElement.ariaRowIndex = idx + 1;
            htmlDivElement.innerHTML = `
                <div>
                    <p class="additional-title">${idx + 1}. ${x.title}</p>
                    <div class="flex gap-1 pt-1 justify-space-between">
                        <p class="additional-desc">description</p>
                        <img class="additional-img" src="${x.imgUrl}" alt="${x.title}"></img>
                    </div>
                </div>
                `;

            hotNewsAreaElem.appendChild(htmlDivElement);
        })
    }
}

// document ready
document.addEventListener("DOMContentLoaded", function () {
    main();
});
