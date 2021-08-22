package test;

import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.IllegalFormatException;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class Test {
    final static String lastElement = "{\"p\":[\"[exécution terminée]\"],\"d\":0,\"id\":300}";
    private final ArrayList<JSONArray> outputs = new ArrayList<>();
    private final ArrayList<String> inputs = new ArrayList<>();
    private final Hashtable<String, Boolean> results = new Hashtable<>();
    private int idx = 0;

    private static JSONArray executeAliveScript(String input) {
        Executeur executeur = new Executeur();
        executeur.compiler(input.split("\n"), true);
        try {
            return new JSONArray(executeur.executerMain(false));
        } catch (JSONException err) {
            return null;
        }
    }

    private Stream<JSONObject> getNextOutput() {
        if (idx == 0 && outputs.stream().noneMatch(output -> output.length() == outputs.get(0).length())) {
            throw new IllegalStateException("AAAAAAA");
        }
        if (idx > outputs.get(0).length()) return null;

        ArrayList<JSONObject> nextOutputArray = new ArrayList<>();
        outputs.forEach(output -> nextOutputArray.add(output.getJSONObject(idx)));
        idx++;
        return nextOutputArray.stream();
    }

    public Test expect(String input) {
        this.inputs.add(input);
        this.outputs.add(executeAliveScript(input));
        return this;
    }

    public Test and(String input) {
        return this.expect(input);
    }

    public Test toEnd() {
        Stream<JSONObject> outputs = getNextOutput();
        results.put("print the end message",
                outputs != null && outputs.allMatch(output -> output.toString().equals(lastElement))
        );
        return this;
    }

    public Test toPrint(String printedOutput) {
        Stream<JSONObject> outputs = getNextOutput();
        Data intendedData = new Data(Data.Id.AFFICHER).addParam(printedOutput);
        results.put("print '" + printedOutput + "' to the screen",
                outputs != null && outputs.allMatch(output -> output.toString().equals(intendedData.toString()))
        );
        return this;
    }


    public boolean passTest() {
        boolean result = results.values().stream().allMatch(Predicate.isEqual(true));
        if (!result) {
            System.out.println("The inputs did not pass all the tests");
            System.out.println("inputs:");
            Executeur.printCompiledCode(inputs.toString());
            System.out.println("test results:");
            Executeur.printCompiledCode(results.toString());
        }
        return result;
    }
}
















