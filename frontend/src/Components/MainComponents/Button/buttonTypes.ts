
export type ButtonTypes = "primary" | "secondary" | "danger";

export type ButtonProps = {
  variant: ButtonTypes;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: React.ReactNode;
}