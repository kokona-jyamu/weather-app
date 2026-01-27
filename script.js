const API_KEY = "b69db5cd64b821b1a36ced40ce6d3c34";

async function getWeather(){
    const city = "tokyo";
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`;

    const res = await fetch(url);
    const data = await res.json();

    console.log(data);
}

//初期実行
getWeather();