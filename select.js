/**
 * 2023-08-17
 *
 * @author 마리아
 * @description 이거는 마리아가 만든 파일이므로 지우면 안됩니다.
 */

document.addEventListener("DOMContentLoaded", function () {

    /** SELECTモドキ コンストラクタ
     * @arg  ImitationId Selectモドキの select id
     * @arg  arr 選択肢内容 Array
     */
    function ImitationSelect(ImitationId, arr) {
        var _this = this;
        this.table = document.getElementById(ImitationId);
        this.arr = arr;
        this.selectId = 0; // 選択されている行(プルダウンで選んだ値)
        this.tr1 = this.table.insertRow(-1); // 1行表示用 tr (createElement & appendChild)
        // プルダウンを予め作っておく(safariでの pulldownClose対策)
        var pullDown = document.createElement('table');
        pullDown.className = 'imitationPulldown';
        this.pullDown = pullDown;
        for (var i = 0; i < this.arr.length; i++) {
            var tr = _this.pullDown.insertRow(-1);
            /*tr.onclick = function(i) { _this.selectPD(i); }*/
            tr.addEventListener('click', {
                handleEvent: _this.selectPD,
                obj: _this,
                idx: i
            }, false);
            tr.innerHTML = this.td(i);
        }
        pullDown.style.visibility = "hidden"; // 消しておく
        this.table.appendChild(pullDown);
        document.body.addEventListener('click', function (e) { // 画面がクリックされた時
            if (!e.target.closest('#' + ImitationId)) { // ImitationIdで無ければ
                _this.pulldownClose(); // プルダウンを閉じる
            }
        });
    }

    /* 1行分の表示を得る(trは含まない) */
    ImitationSelect.prototype.td = function (idx) {
        if (idx >= this.arr.length) {
            console.log("out of index [" + idx + "]");
            return "";
        }
        return "<td class='imitationImage'><img class='flag' src='" + this.arr[idx]['img'] +
            "'></td><td class='imitationText' value='" + this.arr[idx]['val'] + "'>" + this.arr[idx]['txt'] +
            "</td>";
    }

    /* SELECTモドキの表示(選択した行だけを表示) */
    ImitationSelect.prototype.disp = function () {
        var _this = this; // ImitationSelect オブジェクト
        this.tr1.innerHTML = this.td(this.selectId);
        this.tr1.onclick = function () {
            _this.pulldownOpen();
        } // クリックされたとき
    }

    /* SELECTモドキをクリックしてプルダウンを開く */
    ImitationSelect.prototype.pulldownOpen = function () {
        this.tr1.onclick = function () {} // 1行表示用 tr の onclick を消す
        this.pullDown.style.visibility = "visible"; // プルダウン表示
    }

    /* プルダウンを閉じる */
    ImitationSelect.prototype.pulldownClose = function () {
        this.pullDown.style.visibility = "hidden";
        this.disp();
    }

    /* プルダウンの中身をクリックした時 */
    ImitationSelect.prototype.selectPD = function (e) {
        if (typeof e === 'object') {
            selectedLng = e.target.getAttribute('value');
        }

        changeLanguage(selectedLng);

        var imSel = this.obj; // 元の ImitationSelect オブジェクト
        imSel.selectId = this.idx; // 選んだ番号
        imSel.pulldownClose(); // プルダウン閉じて元のtr1表示
    }

    ImitationSelect.prototype.selectPDX = function (idx, language) {
        this.selectId = idx; // 選んだ番号
        this.pulldownClose(); // プルダウン閉じて元のtr1表示
        changeLanguage(language);
    }

    /* 実行部 */
    const languages = [{
        txt: 'English',
        img: 'https://malihua-store.s3.ap-northeast-2.amazonaws.com/flag/UN.jpg',
        val: 'en'
    },{
        txt: '日本語',
        img: 'https://malihua-store.s3.ap-northeast-2.amazonaws.com/flag/Japan.jpg',
        val: 'ja'
    },{
        txt: '한국어',
        img: 'https://malihua-store.s3.ap-northeast-2.amazonaws.com/flag/Korean.jpg',
        val: 'ko'
    },{
        txt: '汉语',
        img: 'https://malihua-store.s3.ap-northeast-2.amazonaws.com/flag/China.jpg',
        val: 'cn'
    }, {
        txt: 'Tiếng Việt',
        img: 'https://malihua-store.s3.ap-northeast-2.amazonaws.com/flag/Vietnam.jpg',
        val: 'vi'
    }];
    // 定義と表示
    const sel2 = new ImitationSelect("sel2", languages);
    sel2.disp();
    const language = getLanguage().split('-')[0];

    sel2.selectPDX(languages.findIndex(x => x.val === language), language);
});
