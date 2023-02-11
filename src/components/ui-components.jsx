import { defaultColors } from "../constants";

export const AppButton = ({ onClick, children, ...props }) => {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        padding: "8px",
        "text-align": "left",
        "background-color": defaultColors.primary,
        color: defaultColors.secondary,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
