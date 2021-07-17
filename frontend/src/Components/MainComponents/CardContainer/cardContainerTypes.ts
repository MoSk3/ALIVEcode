
export type StyledCardContainerProps = {
  scrollable?: boolean;
}

export type CardContainerProps = {
  title?: string;
  style?: any;
  icon?: any;
  onIconClick?: any;
  scrollable?: boolean;
  children?: React.ReactChildren | React.ReactElement | Array<React.ReactElement> | string;
}