import { CampfireApp } from "./CampfireApp";
import "./style.css";

async function main() {
  const app = new CampfireApp();
  await app.initialize();

  const loop = () => {
    app.step();
    requestAnimationFrame(loop);
  };
  loop();
}
main();
