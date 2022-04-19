const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input");
locationBtn = inputPart.querySelector("button");
wIcon = document.querySelector(".weather-part img");
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  // if user pressed enter btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    // if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Browser does not support geolocation api");
  }
});
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  // getting lat and long of the user device from coords
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${"a3fe5dd1f3624e0ac046c611a1971bed"}`;
  fetchData();
}
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${"a3fe5dd1f3624e0ac046c611a1971bed"}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  //   // getting api response and returning it with parsing into js obj and in another
  //   // then function calling weatherDetails function with passing api result as an argument
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  infoTxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    // getting required properties value from the info object
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // using custom icon according the id api returned to us
    if (id == 800) {
      wIcon.src = "icons/clear2.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/stormy.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/haze.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.png";
    } else if ((id >= 300 && id <= 321) / (id >= 500 && id <= 531)) {
      wIcon.src = "icons/rainy2.png";
    }

    // passing these values to a particular html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city},${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
