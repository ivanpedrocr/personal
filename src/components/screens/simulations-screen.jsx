import { createSignal } from "solid-js";
import BallSimulation from "../simulations/ball-simulation";
import PlanetaryOrbitSimulation from "../simulations/planetary-orbit-simulation";
import { AppButton } from "../ui-components";

const SimulationsScreen = () => {
  const [selectedSimulation, setSelectedSimulation] = createSignal("");
  const [stopSimulation, setStopSimulation] = createSignal(false);
  const renderSimulation = () => {
    switch (selectedSimulation()) {
      case "gravity-ball":
        return <BallSimulation paused={stopSimulation} />;
      case "planetary-orbit":
        return <PlanetaryOrbitSimulation paused={stopSimulation} />;
      default:
        return <></>;
    }
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      setStopSimulation((value) => !value);
    }
  });
  return (
    <div style={{ display: "flex", flex: 1, "flex-direction": "column" }}>
      <div
        style={{
          "flex-direction": "column",
          display: "flex",
          "justify-content": "flex-start",
        }}
      >
        <AppButton
          onClick={() => {
            setSelectedSimulation((selected) =>
              selected !== "gravity-ball" ? "gravity-ball" : ""
            );
          }}
        >
          Gravity Ball
        </AppButton>
        <AppButton
          onClick={() => {
            setSelectedSimulation((selected) =>
              selected !== "planetary-orbit" ? "planetary-orbit" : ""
            );
          }}
        >
          Planetary Orbit
        </AppButton>
      </div>
      <div
        style={{
          width: "100%",
          "align-content": "center",
          "justify-content": "center",
          display: "flex",
        }}
      >
        {renderSimulation()}
      </div>
    </div>
  );
};

export default SimulationsScreen;
