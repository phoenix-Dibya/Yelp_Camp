mapboxgl.accessToken = mapToken;
console.log(campground.geometry.coordinates);
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // custom style url from https://studio.mapbox.com/
    center: campground.geometry.coordinates, // starting position
    zoom: 6, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}`
        )
    )
    .addTo(map);
