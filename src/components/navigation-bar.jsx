import { A } from "@solidjs/router";
import { For } from "solid-js";
import { defaultColors } from "../constants";

const NavigationBar = ({ navigationOptions }) => {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "row",
        padding: "32px",
        "justify-content": "space-between",
      }}
    >
      <h3>Ivan C</h3>
      <div
        style={{
          display: "flex",
          "flex-direction": "row",
          gap: "16px",
        }}
      >
        <For each={navigationOptions}>
          {(link) => {
            return (
              <A
                style={{
                  "font-size": "16px",
                  color: defaultColors.secondary,
                  "font-style": "normal",
                  "text-decoration": "none",
                }}
                {...link}
              >
                {link.title}
              </A>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default NavigationBar;
