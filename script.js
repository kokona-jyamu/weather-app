const API_KEY = "b69db5cd64b821b1a36ced40ce6d3c34";
const CITY = "Tokyo";


let todos = JSON.parse(localStorage.getItem("todo"))||[];



//API取得
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



getWeather();
renderDate();