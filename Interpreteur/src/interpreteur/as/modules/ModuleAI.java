package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

/**
 * Module containing all methods related to artificial intelligence.
 *
 * @author Felix Jobin
 */
public class ModuleAI {

    //Sets how many numbers are after the coma when rounding, depending on the amount of zeroes.
    private static final double ROUNDING_FACTOR = 10000.0;

    /**
     * Finds the mean of all the elements in the <b>data</b> array.
     * If the array is empty, throws an error message.
     *
     * @param data The array of values in which we want to find the mean.
     * @return The mean of the array values.
     * @throws NoDataException if the array is empty.
     */
    public static double mean(Double[] data) throws NoDataException {
        //General case
        return summation(data) / (double) data.length;
    }

    /**
     * Finds the sum of all values inside the <b>data</b> array.
     * If the array is empty, throws an error message.
     *
     * @param data The array of values in which we want to find the sum.
     * @return The sum of the array values.
     * @throws NoDataException if the array is empty.
     */
    public static double summation(Double[] data) throws NoDataException {
        //Case where data.length == 0
        double sum = 0;
        if (data.length == 0)
            throw new DifferentArrayLengthException("Erreur sommation() : la liste de données est vide");

        //General case
        for (Double datum : data) {
            sum += datum;
        }
        return sum;
    }

    /**
     * Finds the standard deviation of all values inside the <b>data</b> array.
     * If the array is empty, throws an error message.
     *
     * @param data The array of values in which we want to find the standard deviation.
     * @return The standard deviation of the array values.
     * @throws NoDataException if the array is empty.
     */
    public static double standardDeviation(Double[] data) throws NoDataException {
        double strdDev = 0;
        double mean = mean(data);

        //Case where data.length == 0
        if (data.length == 0) throw new NoDataException("Erreur ecartType() : la liste de données est vide");
        Double[] differences = new Double[data.length];

        //General case
        for (int i = 0; i < differences.length; i++) {
            differences[i] = Math.pow(data[i] - mean, 2);
        }
        strdDev = Math.sqrt(summation(differences) / (double) differences.length);
        return strdDev;
    }

    /**
     * <p>
     * Calculates the <b>coefficient of correlation</b>, which describes the linear relationship between two variables.
     * It takes two double arrays of <u>the same length</u> as arguments. The first is for the independent variable
     * (<b>x</b>), and the second for the dependent variable (<b>y</b>).
     * </p>
     *
     * <p>
     * If the returned value is > 0, the two variables increase most-likely together. If it is < 0,
     * when the first variable increases, the second one most-likely decreases.
     * If the result is near 0, it means that there is no strong relationship between the two variables.
     * </p>
     *
     * <p>
     * If the arrays does not have the same length, sends an error message to the user (IN THE CONSOLE FOR NOW, NOT FINISHED).
     * If one of the arrays is empty, throws an error message.
     * </p>
     *
     * @param x The values of the independent variable.
     * @param y The values of the dependent variable.
     * @return The correlation coefficient (<b>r</b>).
     * @throws DifferentArrayLengthException if the two arrays are not the same length.
     * @throws NoDataException               if one of the arrays is empty.
     */
    public static double correlationCoefficient(Double[] x, Double[] y) throws DifferentArrayLengthException, NoDataException {
        double r = 0;
        int n = 0;

        //Cases where an array is empty
        if (x.length == 0)
            throw new NoDataException("Erreur coefficientCorrelation() des données x : la liste de données x est vide");
        if (y.length == 0)
            throw new NoDataException("Erreur coefficientCorrelation() des données y : la liste de données y est vide");

        //Case where x data and y data are not the same amount
        if (x.length == y.length) n = x.length;
        else {
            throw new DifferentArrayLengthException("Erreur coefficientCorrelation() : les deux listes ne sont pas de la même longueur.");
        }

        //Calculating the x*y array
        Double[] xy = new Double[n];
        for (int i = 0; i < n; i++) {
            xy[i] = x[i] * y[i];
        }

        //Calculating the x*x array
        Double[] x2 = new Double[n];
        for (int i = 0; i < n; i++) {
            x2[i] = x[i] * x[i];
        }

        //Calculating the y*y array
        Double[] y2 = new Double[n];
        for (int i = 0; i < n; i++) {
            y2[i] = y[i] * y[i];
        }

        //Calculating the r value
        double numerator = n * summation(xy) - (summation(x) * summation(y));
        double denominator = (n * summation(x2) - Math.pow(summation(x), 2)) * (n * summation(y2) - Math.pow(summation(y), 2));

        r = numerator / Math.sqrt(denominator);

        return Math.round(r * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * <p>
     * Calculates the coefficient of determination, which describes the relationship between two variables in general.
     * This value is always between 0 and 1. It takes two double arrays of <u>the same length</u> as arguments.
     * The first is for the independent variable (<b>x</b>), and the second for the dependent variable (<b>y</b>).
     * </p>
     *
     * <p>
     * If the returned value is near 0, there is no strong relationship between the two variables.
     * If the returned value is near 1, there is a strong relationship between the two variables.
     * </p>
     *
     * <p>
     * If the arrays does not have the same length, sends an error message to the user (IN THE CONSOLE FOR NOW, NOT FINISHED).
     * If one of the arrays is empty, throws an error message.
     * </p>
     *
     * @param x The values of the independent variable.
     * @param y The values of the dependent variable.
     * @return The determination coefficient (<b>R<sup>2</sup></b>).
     * @throws DifferentArrayLengthException if the two arrays are not the same length.
     * @throws NoDataException               if one of the arrays is empty.
     */
    public static double determinationCoefficient(Double[] x, Double[] y) throws DifferentArrayLengthException, NoDataException {
        double r2 = 0;

        r2 = Math.pow(correlationCoefficient(x, y), 2);

        return Math.round(r2 * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * Evaluates the cost function with the predicted values from a model and the real values from a data
     * distribution. It uses the <u>Mean Absolute Error</u> method to calculate the cost function.
     *
     * @param predictedValues the predicted values from the model.
     * @param realValues      the real values from the dataset.
     * @return the mean absolute error according to the data.
     * @throws NoDataException               if one of the arrays is empty.
     * @throws DifferentArrayLengthException if the two arrays are not the same length.
     */
    public static double evaluateCostFunction(Double[] predictedValues, Double[] realValues) throws NoDataException, DifferentArrayLengthException {
        if (predictedValues.length == 0)
            throw new NoDataException("Erreur optimiserFonction() : la liste de données prédites est vide");
        if (realValues.length == 0)
            throw new NoDataException("Erreur optimiserFonction() : la liste de données y est vide");
        if (predictedValues.length != realValues.length)
            throw new DifferentArrayLengthException("Erreur optimiserFonction() : les deux listes ne sont pas de la même longueur.");

        Double[] errors = new Double[realValues.length];
        for (int i = 0; i < errors.length; i++) {
            errors[i] = Math.abs(predictedValues[i] - realValues[i]); //error calculated
        }
        double mean = mean(errors);

        return Math.round(mean * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * Returns the rounding factor of the class.
     *
     * @return the rounding factor.
     */
    public static double getRoundingFactor() {
        return ROUNDING_FACTOR;
    }

    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASObjet.Fonction[]{
                /*
                 Calculates the mean of a list of numbers.
                */
                new ASObjet.Fonction("moyenne",
                        new ASObjet.Fonction.Parametre[]{
                                new ASObjet.Fonction.Parametre(
                                        ASObjet.TypeBuiltin.liste.asType(),
                                        "lst",
                                        null
                                )
                        },
                        ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        Liste liste = (Liste) this.getValeurParam("lst");
                        var doubles = liste.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        return new Decimal(mean(doubles));
                    }
                },

                /*
                  Calculates the standart deviation of a list of numbers.
                */
                new ASObjet.Fonction("ecartType", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(
                                ASObjet.TypeBuiltin.liste.asType(),
                                "lst",
                                null
                        )
                }, ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        Liste liste = (Liste) this.getValeurParam("lst");
                        Double[] doubles;
                        //liste.getValue().stream().map(Object::toString).allMatch(Nombre::estNumerique);
                        try {
                            doubles = liste.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        } catch (ClassCastException err) {
                            throw new ASErreur.ErreurType("La fonction ecartType prend une liste de nombre, mais la liste pass\u00E9e en param\u00E8tre n'est pas compos\u00E9e que de nombres.");
                        }
                        return new Decimal(standardDeviation(doubles));
                    }
                },

                /*
                  Calculates the correlation coefficient of two list of numbers which together are representing
                  coordinates. The first list contains all X values for each point while the second list
                  contains all Y values for each point.

                  If both lists are not the same length, an error will be generated.
                */
                new ASObjet.Fonction("coefficientCorrelation", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(
                                ASObjet.TypeBuiltin.liste.asType(),
                                "lst1",
                                null
                        ),
                        new ASObjet.Fonction.Parametre(
                                ASObjet.TypeBuiltin.liste.asType(),
                                "lst2",
                                null
                        )
                }, ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        Liste lst1 = (Liste) this.getValeurParam("lst1");
                        Liste lst2 = (Liste) this.getValeurParam("lst2");
                        Double[] x;
                        Double[] y;
                        try {
                            x = lst1.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                            y = lst2.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        } catch (ClassCastException err) {
                            throw new ASErreur.ErreurType("La fonction ecartType prend une liste de nombre, mais la liste pass\u00E9e en param\u00E8tre n'est pas compos\u00E9e que de nombres.");
                        }
                        return new Decimal(correlationCoefficient(x, y));
                    }
                },

                /*
                  Calculates the determination coefficient of two list of numbers which together are representing
                  coordinates. The first list contains all X values for each point while the second list
                  contains all Y values for each point.

                  If both lists are not the same length, an error will be generated.
                */
                new ASObjet.Fonction("coefficientDetermination", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(
                                ASObjet.TypeBuiltin.liste.asType(),
                                "lst1",
                                null
                        ),
                        new ASObjet.Fonction.Parametre(
                                ASObjet.TypeBuiltin.liste.asType(),
                                "lst2",
                                null
                        )
                }, ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        Liste lst1 = (Liste) this.getValeurParam("lst1");
                        Liste lst2 = (Liste) this.getValeurParam("lst2");
                        Double[] x;
                        Double[] y;
                        try {
                            x = lst1.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                            y = lst2.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        } catch (ClassCastException err) {
                            throw new ASErreur.ErreurType("La fonction ecartType prend une liste de nombre, mais la liste pass\u00E9e en param\u00E8tre n'est pas compos\u00E9e que de nombres.");
                        }
                        return new Decimal(determinationCoefficient(x, y));
                    }
                },

                /*
                  Returns the values of the specified column. (AJOUTER LES DONNÉES DE CHAQUE COLONNE)
                */
                new ASObjet.Fonction("valeursColonne", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(
                                ASObjet.TypeBuiltin.texte.asType(),
                                "col",
                                null
                        )
                }, ASObjet.TypeBuiltin.liste.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        String col = this.getValeurParam("col").getValue().toString();
                        executeurInstance.addData(new Data(Data.Id.VALEURS_COLONNE).addParam(col));
                        return null;

                        //  A TERMINER
                    }
                },
                new ASObjet.Fonction("afficherGraphique", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(
                                ASObjet.TypeBuiltin.texte.asType(),
                                "type",
                                null
                        )
                }, ASObjet.TypeBuiltin.nulType.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        String col = this.getValeurParam("type").getValue().toString();
                        return new Nul();
                    }
                }
        }, new ASObjet.Variable[]{});
    }

    private static class NoDataException extends ASErreur.ErreurAliveScript {
        public NoDataException(String message) {
            super(message, "ErreurAucuneDonnee");
        }
    }

    private static class DifferentArrayLengthException extends ASErreur.ErreurAliveScript {
        public DifferentArrayLengthException(String message) {
            super(message, "ErreurTailleDeListeIncompatible");
        }
    }
}




















