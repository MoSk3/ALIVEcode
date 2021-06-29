package interpreteur.utils;

import java.util.Arrays;
import java.util.function.Predicate;

public class ArraysUtils {

    public static String join(String delemiter, Object[] array) {
        return String.join(delemiter, Arrays.stream(array).map(Object::toString).toArray(String[]::new));
    }

}
