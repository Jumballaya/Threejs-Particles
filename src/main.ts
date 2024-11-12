import { FireworksApp } from "./FireworksApp";
import "./style.css";

async function main() {
  const app = new FireworksApp();
  await app.initialize();

  const loop = () => {
    app.step();
    requestAnimationFrame(loop);
  };
  loop();
}
main();
