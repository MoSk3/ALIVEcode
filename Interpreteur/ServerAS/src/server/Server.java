package server;

import com.sun.net.httpserver.*;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class Server {

    public static void main(String[] args) throws IOException {

        Dotenv env = Dotenv.configure()
                .directory("./.env")
                .load();

        final int PORT = Integer.parseInt(env.get("SERVER_PORT"));
        final String AS_URL = env.get("AS_URL");

        HttpServer server = HttpServer.create(new InetSocketAddress(AS_URL, PORT), 2);

        System.out.println("Starting server...");

        AliveScriptApi aliveScriptApi = new AliveScriptApi(env.get("CORS_ORIGIN") + ":" + env.get("HOST_PORT"));
        HttpContext context = server.createContext("/" + env.get("COMPILE_PATH") + "/");

        context.setHandler(aliveScriptApi);

        System.out.println("Server listening on port " + PORT);
        System.out.println("Compile alivescript programs by sending a POST request to " + AS_URL + ":" + PORT + "/" + env.get("COMPILE_PATH") + "/"
                + " from " + env.get("CORS_ORIGIN") + ":" + env.get("HOST_PORT"));

        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
        server.setExecutor(threadPoolExecutor);
        server.start();
    }
}
