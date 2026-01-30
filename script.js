const API_KEY = "b69db5cd64b821b1a36ced40ce6d3c34";
const CITY = "Tokyo";


let todos = JSON.parse(localStorage.getItem("todo"))||[];



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
//日付取得
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
//5day3hourの天気API取得
async function getDateWeather() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Tokyo&appid=${API_KEY}&units=metric&lang=ja`;
    const res = await fetch(url);
    if (!res.ok) {
        console.error("APIエラー:", res.status);
        return;
    }

    const targetHours = ["6:00:00","9:00:00","12:00:00","15:00:00","18:00:00","21:00:00"];
    const todayList = data.list.filter(item =>{
        return targetHours.some(hour => item.dt_txt.includes(hour));
    });

    const container = document.getElementById("hourly");
    innerHTML="";

    todayList.forEach(item =>{
        const time = item.dt_txt.slice(11,16);
        const temp = Math.around(item.main.temp);
        const icon = getWeatherIcon(item.weather[0].main);

        const card=`
        <div class="hour-card">
            <div>${time}</div>
            <div class="hour-icon">${icon}</div>
            <div>${temp}℃</div>
        </div>
        `;

        container.insertAdjacentHTML("beforeend",card);

    });    
}



getWeather();
renderDate();
getDateWeather();