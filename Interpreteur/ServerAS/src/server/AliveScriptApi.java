package server;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public record AliveScriptApi(String CORS_ORIGIN) implements HttpHandler {

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String requestParamValue;

        Headers headers = httpExchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", CORS_ORIGIN);
        headers.set("Access-Control-Allow-Credentials", "true");
        headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

        requestParamValue = switch (httpExchange.getRequestMethod().toUpperCase()) {
            case "GET", "OPTIONS" -> "{}";
            case "POST" -> handlePostRequest(httpExchange);
            default -> "";
        };
        assert requestParamValue != null;
        handleResponse(httpExchange, requestParamValue);
    }

    private JSONObject byteArrayToJson(byte[] byteArray) {
        StringBuilder inputData = new StringBuilder();
        for (byte b : byteArray) {
            inputData.append((char) b);
        }
        return new JSONObject(inputData.toString());
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
            String[] lignes = data.getString("lines").split("\n");
            JSONArray compileResult = aliveScriptService.compile(lignes);

            return compileResult.length() == 0
                    ? aliveScriptService.execute()
                    : new JSONObject().put("result", compileResult).toString();
        } else {
            aliveScriptService.destroy();
        }
        return "{}";
    }

    private void handleResponse(HttpExchange httpExchange, String requestParamValue) throws IOException {

        OutputStream outputStream = httpExchange.getResponseBody();
        byte[] responseBytes = requestParamValue.getBytes();

        // this line is a must
        httpExchange.sendResponseHeaders(200, responseBytes.length);
        outputStream.write(responseBytes);

        outputStream.flush();

        outputStream.close();

    }
}


























