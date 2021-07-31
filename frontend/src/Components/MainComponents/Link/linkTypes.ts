
export type StyledLinkProps = {
  dark?: boolean;
  bold?: boolean;
  block?: boolean;
}

export type LinkProps = {
  children?: React.ReactChildren | React.ReactElement | string;
  className?: any;
  to?: string;
  onClick?: () => void;
  style?: any;
  dark?: boolean;
  bold?: boolean;
  block?: boolean;
}