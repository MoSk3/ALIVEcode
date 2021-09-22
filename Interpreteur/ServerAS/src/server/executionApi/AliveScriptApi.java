package server.executionApi;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import org.json.JSONArray;
import org.json.JSONObject;
import server.BaseApi;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;


/**
 * --- AliveScriptApi ---
 *
 * @author Mathis Laroche
 */
public class AliveScriptApi extends BaseApi {

    public AliveScriptApi(String CORS_ORIGIN) {
        super(CORS_ORIGIN);
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        super.handle(httpExchange);
        String requestParamValue;

        requestParamValue = switch (httpExchange.getRequestMethod().toUpperCase()) {
            case "GET", "OPTIONS" -> "{}";
            case "POST" -> handlePostRequest(httpExchange);
            default -> "";
        };
        assert requestParamValue != null;
        handleResponse(httpExchange, requestParamValue);
    }


    private boolean hasValidDataStructure(JSONObject data) {
        List<String> mustHaveFields = Arrays.asList(
                "metadata",
                "lines"
        );
        boolean allFields = mustHaveFields.stream().allMatch(data::has);

        return true;
    }

    private String handlePostRequest(HttpExchange httpExchange) throws IOException {
        JSONObject data = byteArrayToJson(httpExchange.getRequestBody().readAllBytes());


        AliveScriptService aliveScriptService;

        if (data.has("idToken"))
            try {
                aliveScriptService = AliveScriptService.get(UUID.fromString(data.getString("idToken")));
            } catch (IllegalArgumentException err) {
                return new JSONObject()
                        .put("status", AliveScriptService.ResponseStatus.FAILED)
                        .put("message", "the id passed in the field idToken is not a valid UUID").toString();
            }
        else
            aliveScriptService = AliveScriptService.create();


        if (aliveScriptService == null) {
            return AliveScriptService.noAliveScriptServiceWithToken().toString();
        }

        aliveScriptService.update();

        if (data.has("response-data")) {
            if (!aliveScriptService.isCompiled()) {
                return aliveScriptService.notCompiledError().toString();
            }
            if (!(data.get("response-data") instanceof JSONArray responseData)) {
                return new JSONObject()
                        .put("status", AliveScriptService.ResponseStatus.FAILED)
                        .put("message", "the field response-data must contain an array").toString();
            }
            aliveScriptService.pushDataToExecuteur(responseData);
            return aliveScriptService.execute();

        } else if (data.has("lines")) {
            var lines = data.get("lines");
            String[] lignes;
            if (lines instanceof JSONArray ligneArray) {
                lignes = new String[ligneArray.length()];
                for (int i = 0; i < ligneArray.length(); i++) {
                    lignes[i] = ligneArray.getString(i);
                }
            } else
                lignes = ((String) lines).split("\n");

            JSONArray compileResult = aliveScriptService.compile(lignes);

            return compileResult.length() == 0
                    ? aliveScriptService.execute()
                    : new JSONObject().put("result", compileResult).toString();
        } else {
            aliveScriptService.destroy();
        }
        return "{}";
    }
}


























