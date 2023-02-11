import { Route, Routes } from "@solidjs/router";
import NavigationBar from "./components/navigation-bar";
import HomeScreen from "./components/screens/home-screen";
import SimulationsScreen from "./components/screens/simulations-screen";
import { navigationOptions } from "./constants";
import { defaultColors } from "./constants";

function App() {
  return (
    <div
      style={{
        "min-height": "100vh",
        "background-color": defaultColors.primary,
      }}
    >
      <NavigationBar navigationOptions={navigationOptions} />
      <div style={{ padding: "32px" }}>
        <Routes>
          <Route path="/" component={HomeScreen} />
          <Route path="/simulations" component={SimulationsScreen} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
