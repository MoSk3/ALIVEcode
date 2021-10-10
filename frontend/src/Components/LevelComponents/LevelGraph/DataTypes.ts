/**
 * This interface defines all appliable types for objects representing data.
 */
export default interface DataTypes {
  type: string;
	label: string;
  data: any[];
  backgroundColor?: string;
  borderColor?: string;
	borderWidth?: number;
  pointRadius?: number;
  pointBorderWidth?: number;
  pointBackgroundColor?: string;
}