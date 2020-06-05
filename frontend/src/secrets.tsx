class Secrets {
  mapsKey: string;
  constructor() {
    try { 
      const secrets = require("./secrets.json");
      this.mapsKey = secrets["maps-api-key"]
    }
    catch (e) {
      throw new Error("No secrets.json detected. Please place secrets.json in the project root following the template.");
    }
  }
}

export default new Secrets();