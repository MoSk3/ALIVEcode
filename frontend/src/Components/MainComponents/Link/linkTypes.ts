
export type StyledLinkProps = {
  dark?: boolean;
  bold?: boolean;
  block?: boolean;
}

export type LinkProps = {
  children?: React.ReactChildren | React.ReactElement | string;
  to: string;
  style?: any;
  dark?: boolean;
  bold?: boolean;
  block?: boolean;
}