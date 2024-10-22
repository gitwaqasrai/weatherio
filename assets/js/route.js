/**
 * @license MIT
 * @fileoverview All API-related stuff like API key, API requests, etc.
 * @copyright codewithwaqas 2024 All rights reserved
 * @author codewithwaqas <waqasrai678@gmail.com>
 */

import { updateWeather } from "./app.js"; // Correct import

// ... (rest of the code remains the same)

// import { updateWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";

const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    },
    (err) => {
      console.error("Geolocation error:", err.message);
      window.location.hash = defaultLocation;
    }
  );
};

const searchedLocation = (query) =>
  query ? updateWeather(...query.split("&")) : error404();

const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchedLocation],
]);

const checkHash = function () {
  const requestURL = window.location.hash.slice(1);
  const [route, query] = requestURL.includes("?")
    ? requestURL.split("?")
    : [requestURL];
  const routeHandler = routes.get(route);
  routeHandler ? routeHandler(query) : error404();
};

window.addEventListener("hashchange", checkHash);
window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
