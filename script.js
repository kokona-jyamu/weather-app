//API取得
const API_KEY = "b69db5cd64b821b1a36ced40ce6d3c34";
const CITY = "Tokyo";

//JSON.parse() = 取得したJSON文字列のデータを、JavaScriptで扱えるオブジェクトに変換
//localStorageを活用してtodoリストを取得
let todos = JSON.parse(localStorage.getItem("todo"))||[];

// bg：時間に合わせた背景画像設定
function setBackgroundByTime(){
  //定数hour（現在時刻の取得 ▶ 時間の取得）
  const hour = new Date().getHours();

  let imageName = "";
  if(hour>=4 && hour<9){
    imageName = "weatherapp-morning.jpg";
  }else if(hour<15){
    imageName = "weatherapp-lunch.jpg";
  }else if(hour<19){
    imageName = "weatherapp-evening.jpg";
  }else{
    imageName = "weatherapp-night.jpg";
  }
  //HTML(body)-CSS(backroundimage)
  //テンプレートリテラル - ${A}
  document.body.style.backgroundImage = `url('assets/bg/${imageName}')`;
}

//都市検索
const params = new URLSearchParams(window.location.search);
const city = params.get("city");
if (city) {
    document.getElementById("city-name").textContent = city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ja`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = document.getElementById("result");
            if (data || data.cod != 200) {
                result.innerHTML = "<p>天気情報を取得できませんでした。</p>";
            }
        })
        .catch(error => {
            document.getElementById("result").innerHTML = "<p>通信エラーが発生しました。</p>";
        });
}

//今日の天気API取得
async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=ja`;
  const res = await fetch(url);
  //「res.ok = データの取得完了」ができてない場合
  if (!res.ok) {
    console.error("APIエラー:", res.status);
    return;
  }

  const data = await res.json();
  console.log(data);
  //// HTML(id) - text上書き = 上書き内容
  document.getElementById("temp-max").textContent = Math.round(data.main.temp_max) + "℃";
  document.getElementById("temp-min").textContent = Math.round(data.main.temp_min) + "℃";
  document.getElementById("humidity").textContent = "湿度"+Math.round(data.main.humidity) + "%";
  document.getElementById("wind").textContent = "風速"+Math.round(data.wind.speed) + " m/s";
  document.getElementById("icon").textContent = getWeatherIcon(data.weather[0].main);
}

//各都市の今日の天気API取得
async function getWeatherFavorite() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`;
  const res = await fetch(url);
  //「res.ok = データの取得完了」ができてない場合
  if (!res.ok) {
    console.error("APIエラー:", res.status);
    return;
  }

  const data = await res.json();
  console.log(data);
  //// HTML(id) - text上書き = 上書き内容
  document.getElementById("temp-max").textContent = Math.round(data.main.temp_max) + "℃";
  document.getElementById("temp-min").textContent = Math.round(data.main.temp_min) + "℃";
  document.getElementById("humidity").textContent = "湿度"+Math.round(data.main.humidity) + "%";
  document.getElementById("wind").textContent = "風速"+Math.round(data.wind.speed) + " m/s";
  document.getElementById("icon").textContent = getWeatherIcon(data.weather[0].main);
}

//年月日・日付取得
function renderDate(){
    const date = new Date();
    const text = `${date.getFullYear()}年
                  ${date.getMonth()+1}月
                  ${date.getDate()}日`;
    document.getElementById("date").textContent = text;
}

//天気ごとのアイコン
function getWeatherIcon(main) {
  //早期リターン
  switch (main) {
    case "Clear":
    return "☀️";
    case "Clouds":
    return "☁️";
    case "Rain":
    return "🌧️";
    case "Snow":
    return "☃️";
    default:
    return "🌤️";
  }
}

//5day3hourの天気API取得（2日分表示）
async function getDateWeather() { 
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=Tokyo&appid=${API_KEY}&units=metric&lang=ja`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("APIエラー:", res.status);
    return;
  }

  const data = await res.json();
  const targetHours = ["06:00:00","09:00:00","12:00:00","15:00:00","18:00:00","21:00:00"];
  const now = new Date();

  // 今日
  const today =`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  // 明日(今日分が上書きされないようにまず定義する！)
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow =`${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth()+1).padStart(2,'0')}-${String(tomorrowDate.getDate()).padStart(2,'0')}`;

  // 今日＋明日だけ取得
  // YYYY-MM-DD(0-10) HH:mm:ss(11-)
  const filteredList = data.list.filter(item => {
    const date = item.dt_txt.slice(0,10);
    const time = item.dt_txt.slice(11);
    return (date === today || date === tomorrow) && targetHours.includes(time);
  });

  // 日付ごとにグループ化
  const grouped = {};
  filteredList.forEach(item => {
    const date = item.dt_txt.slice(0,10);
    //新しい日付の引き出しを作成
    if (!grouped[date]) {
      grouped[date] = [];
    }
    //Array.prototype.push()を活用
    grouped[date].push(item);
  });

  //hourlyを掃除
  const container = document.getElementById("hourly");
  container.innerHTML = "";

  // 日付ごとに表示
  for (const date in grouped) {
    const dateObj = new Date(date);
    const label = `${dateObj.getMonth()+1}/${dateObj.getDate()}`;
    //カードを一時的に貯めておくための「空の箱」を用意
    let cardsHTML = "";

    grouped[date].forEach((item, index) => {
      const time = item.dt_txt.slice(11,16);
      const temp = Math.round(item.main.temp);
      const icon = getWeatherIcon(item.weather[0].main);
      //カードを次々作成
      cardsHTML += `
        <div class="hour-card"
            data-date="${date}"
            style="animation-delay:${index * 0.2}s">
          <div>${time}</div>
          <div class="hour-icon">${icon}</div>
          <div>${temp}℃</div>
        </div>
      `;

    });

    const section = `
      <div class="day-group">
        <div class="day-cards">
          ${cardsHTML}
        </div>
      </div>
    `;

    // insertAdjacentHTML : 指定した場所に作成したHTMLを差し込む命令（今日明日の分が挿入）
    container.insertAdjacentHTML("beforeend", section);
  }
  //日付を常に表示
  setTimeout(updateCenterDate, 100);
}

//1weekの天気取得
async function getWeeklyWeather() {

  //API
  //取得の住所URLを作成
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=Tokyo&appid=${API_KEY}&units=metric&lang=ja`;
  //const定数「res」でurlを取得（このときはレスポンス全般）
  const res = await fetch(url);
  //const定数「date」でresで取得したレスポンスをJSで使いやすいように（オブジェクトリテラル的な）
  const data = await res.json();
  //const定数「grouped」で空箱作り（日付をKEYにしたいので｛｝を使用 / Javaでいうコレクションみたいな）
  const grouped = {};

  //日付ごとにまとめる
  data.list.forEach(item => {
    //item.dt_txt ▶ "2026-02-20 15:00:00" ここからsliceで10文字目まで
    const date = item.dt_txt.slice(0,10);
    //日付KEYの箱がない場合作成
    if(!grouped[date]){
      grouped[date] = [];
    }
    //この日の配列にデータを追加
    grouped[date].push(item);
  });

  //const定数「container」にHTML内のID「weekly」からDOM要素を得ている
  const container = document.getElementById("weekly");
  container.innerHTML = "";
  let count = 0;

  //各日ごとに最高・最低気温を出す
  //for文でgroupedのKEYをひとつずつ取り出す
  for(const date in grouped){
    //7日分まで表示
    if(count >= 7) break; 
    //grouped[date] ▶ この日の3時間ごとのデータ / これを.mapでtempだけの新しい配列を作成
    const temps = grouped[date].map(item => item.main.temp);
    //最高気温・最低気温の取得
    const max = Math.round(Math.max(...temps));
    const min = Math.round(Math.min(...temps));
    //その日の最初の時間の weather 配列の1番目
    const icon = getWeatherIcon(grouped[date][0].weather[0].main);
    //日付専用のオブジェクト
    const dateObj = new Date(date);
    //dateの月日をgetして「label」に入れる
    const label = `${dateObj.getMonth()+1}/${dateObj.getDate()+1}`;
    //HTMLでの表記内容
    const card = `
      <div class="week-card">
        <div class="week-date">${label}</div>
        <div class="week-icon">${icon}</div>
        <div class="week-temp-max">${max}℃</div>
        <div class="week-temp-min">${min}℃</div>
      </div>
    `;
    //insertAdjacentHTML : 指定した場所に作成したHTMLを差し込む命令
    container.insertAdjacentHTML("beforeend", card);
    //ここまでの処理終えたらcountが7になるまで足していく
    count++;
  }
}

//日付真ん中表記＋下記データスクロール
function updateCenterDate() {
  const container = document.getElementById("hourly");
  const cards = document.querySelectorAll(".hour-card");
  const containerCenter = container.scrollLeft + container.offsetWidth / 2;

  let closestCard = null;
  let closestDistance = Infinity;  //無限大

  cards.forEach(card => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(containerCenter - cardCenter);     //絶対値
    if (distance < closestDistance) {                            //無限に設定したものよりも距離が近くにある場合（確定）
      closestDistance = distance;
      closestCard = card;
    }
  });

  if (closestCard) {
    const date = closestCard.dataset.date;
    const dateObj = new Date(date);
    const label = `${dateObj.getMonth()+1}/${dateObj.getDate()}`;

    document.getElementById("current-date-label").textContent = label;
  }
}

//DOMContentLoaded：準備が完璧に整ったらすべて実行
window.addEventListener("DOMContentLoaded", () => {

  setBackgroundByTime();
  getWeather();
  getWeatherFavorite()
  renderDate();
  getDateWeather();
  getWeeklyWeather();

  const hourly = document.getElementById("hourly");
  hourly.addEventListener("scroll", updateCenterDate);

});

