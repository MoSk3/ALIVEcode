
/**
 * This class defines a third degree polynomial function that can be shown in a scatter plot of a line graph.
 * 
 * The equation of a polynomial function is described as this :
 * f(x) = a*x^3 + b*x^2 + c*x + d
 * where a, b, c and d are the 4 parameters of the function.
 * 
 * It also contains methods to optimize the function with another dataset.
 * 
 * @author Félix Jobin
 */
export default class Function {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  /**
   * Creates a function with its 4 parameters.
   * @param a the parameter for x^3.
   * @param b the parameter for x^2.
   * @param c the parameter for x^1.
   * @param d the parameter for x^0.
   */
  constructor(a: number, b: number, c: number, d: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  /**
   * Generates an array of points that can be used to be plotted on a graph.
   * @param nbPoints the number of points needed.
   * @param minRange the min value of x.
   * @param maxRange the max value of x.
   * @returns an array of points.
   */
  public generatePoints(nbPoints: number, minRange: number, maxRange: number): any {
    let points = [];

    // If the minimum is bigger than the maximum
    if (minRange > maxRange) {
      const temp = minRange;
      minRange = maxRange;
      maxRange = temp;
    }

    // Generate points
    const jump = (maxRange - minRange) / nbPoints;
    for (let i = 0; i < nbPoints; i++) {
      const x = minRange + i * jump;
      const y = this.a * Math.pow(x, 3) + this.b * x * x + this.c * x + this.d;
      points.push({
        "id": i*this.a*this.b*this.c*this.d*jump,
        "x": x,
        "y": y
      });
    }

    return points;
  }
}

