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

  // 明日
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow =`${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth()+1).padStart(2,'0')}-${String(tomorrowDate.getDate()).padStart(2,'0')}`;

  // 今日＋明日だけ取得
  const filteredList = data.list.filter(item => {
    const date = item.dt_txt.slice(0,10);
    const time = item.dt_txt.slice(11);
    return (date === today || date === tomorrow) && targetHours.includes(time);
  });

  // 日付ごとにグループ化
  const grouped = {};
  filteredList.forEach(item => {
    const date = item.dt_txt.slice(0,10);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  const container = document.getElementById("hourly");
  container.innerHTML = "";

  // 日付ごとに表示
  for (const date in grouped) {
    const dateObj = new Date(date);
    const label = `${dateObj.getMonth()+1}/${dateObj.getDate()}`;
    let cardsHTML = "";

    grouped[date].forEach((item, index) => {
      const time = item.dt_txt.slice(11,16);
      const temp = Math.round(item.main.temp);
      const icon = getWeatherIcon(item.weather[0].main);

      cardsHTML += `
        <div class="hour-card"
            data-date="${date}"
            style="animation-delay:${index * 0.1}s">
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

    container.insertAdjacentHTML("beforeend", section);
  }
  //日付を常に表示
  setTimeout(updateCenterDate, 100);
}

//
function updateCenterDate() {
  const container = document.getElementById("hourly");
  const cards = document.querySelectorAll(".hour-card");
  const containerCenter = container.scrollLeft + container.offsetWidth / 2;

  let closestCard = null;
  let closestDistance = Infinity;

  cards.forEach(card => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(containerCenter - cardCenter);
    if (distance < closestDistance) {
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

//
window.addEventListener("DOMContentLoaded", () => {

  setBackgroundByTime();
  getWeather();
  renderDate();
  getDateWeather();

  const hourly = document.getElementById("hourly");
  hourly.addEventListener("scroll", updateCenterDate);

});

