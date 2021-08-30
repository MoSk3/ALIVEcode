import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import interpreteur.executeur.Executeur;
import org.json.JSONObject;

import java.io.*;
import java.util.UUID;

public class AliveScriptApi implements HttpHandler {

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String requestParamValue;

        Headers headers = httpExchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "*");
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

    private String handlePostRequest(HttpExchange httpExchange) throws IOException {
        JSONObject data = byteArrayToJson(httpExchange.getRequestBody().readAllBytes());
        String host = httpExchange.getRemoteAddress().toString().substring(1);

        AliveScriptService aliveScriptService = data.has("idToken")
                ? AliveScriptService.get(UUID.fromString(data.getString("idToken")))
                : AliveScriptService.create();

        if (data.has("response-data")) {
            aliveScriptService.pushDataToExecuteur(data.getJSONArray("response-data"));
            return aliveScriptService.execute();

        } else if (data.has("lines")) {
            String[] lignes = data.getString("lines").split("\n");
            String compileResult = aliveScriptService.compile(lignes);

            return compileResult.equals("[]")
                    ? aliveScriptService.execute()
                    : "{\"idToken\":\"" + aliveScriptService.getIdToken() + "\", \"result\":" + compileResult + "}";
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


























