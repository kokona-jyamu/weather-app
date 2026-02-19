const API_KEY = "b69db5cd64b821b1a36ced40ce6d3c34";
const CITY = "Tokyo";


let todos = JSON.parse(localStorage.getItem("todo"))||[];



//bg：時間に合わせた背景画像設定
function setBackgroundByTime(){
  const hour = new Date().getHours();
  let imageName = "";

  if(hour>=4 && hour<9){
    imageName = "weatherapp-morning.jpg";
  }else if(hour>=9 && hour<15){
    imageName = "weatherapp-lunch.jpg";
  }else if(hour>=15 && hour<19){
    imageName = "weatherapp-evening.jpg";
  }else{
    imageName = "weatherapp-night.jpg";
  }
  document.body.style.backgroundImage = `url('assets/bg/${imageName}')`;
}
//今日の天気API取得
async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=ja`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("APIエラー:", res.status);
    return;
  }

  const data = await res.json();
  console.log(data);

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
  switch (main) {
    case "Clear": return "☀️";
    case "Clouds": return "☁️";
    case "Rain": return "🌧️";
    case "Snow": return "☃️";
    default: return "🌤️";
  }
}
//月日・日付取得
function renderDate2(){
    const date = new Date();
    const text = `${date.getMonth()+1}月
                  ${date.getDate()}日`;
    document.getElementById("date2").textContent = text;
}
//5day3hourの天気API取得
async function getDateWeather() { 
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=Tokyo&appid=${API_KEY}&units=metric&lang=ja`;
  const res = await fetch(url);
  const data = await res.json();

  const targetHours = ["06:00:00","09:00:00","12:00:00","15:00:00","18:00:00","21:00:00"];

  const now = new Date();

  // 今日
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  // 明日
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);

  const tomorrow = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth()+1).padStart(2,'0')}-${String(tomorrowDate.getDate()).padStart(2,'0')}`;

  const todayList = data.list.filter(item => {
    const date = item.dt_txt.slice(0,10);
    const time = item.dt_txt.slice(11);
    return (date === today || date === tomorrow) && targetHours.includes(time);
  });

  const container = document.getElementById("hourly");
  container.innerHTML = "";

  todayList.forEach(item => {
    const time = item.dt_txt.slice(11,16);
    const temp = Math.round(item.main.temp);
    const icon = getWeatherIcon(item.weather[0].main);

    const card = `
      <div class="hour-card">
        <div>${time}</div>
        <div class="hour-icon">${icon}</div>
        <div>${temp}℃</div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", card);
  });

  console.log("カード枚数:", todayList.length);
}




setBackgroundByTime();
getWeather();
renderDate();
renderDate2()
getDateWeather();