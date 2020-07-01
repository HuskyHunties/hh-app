export enum Icons {
    blue = "blue",
    green = "green",
    yellow = "yellow",
    purple = "purple",
    orange = "orange",
    lightblue = "lightblue",
    pink = "pink"
}

const urlMap = new Map<Icons, string>();
urlMap.set(Icons.blue, "http://maps.google.com/mapfiles/ms/icons/blue.png");
urlMap.set(Icons.green, "http://maps.google.com/mapfiles/ms/icons/green.png");
urlMap.set(Icons.yellow, "http://maps.google.com/mapfiles/ms/icons/yellow.png");
urlMap.set(Icons.purple, "http://maps.google.com/mapfiles/ms/icons/purple.png");
urlMap.set(Icons.orange, "http://maps.google.com/mapfiles/ms/icons/orange.png");
urlMap.set(Icons.lightblue, "http://maps.google.com/mapfiles/ms/icons/lightblue.png");
urlMap.set(Icons.pink, "http://maps.google.com/mapfiles/ms/icons/lightblue.png");

export default urlMap;