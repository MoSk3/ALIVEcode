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

        final int PORT = Integer.parseInt(env.get("PORT"));
        final String HOST_NAME = env.get("AS_URL");

        HttpServer server = HttpServer.create(new InetSocketAddress(HOST_NAME, PORT), 2);

        System.out.println("Starting com.server...");

        AliveScriptApi aliveScriptApi = new AliveScriptApi(env.get("CORS_ORIGIN"));
        HttpContext context = server.createContext("/compile/");

        context.setHandler(aliveScriptApi);

        System.out.println("server.Server listening on port " + PORT);

        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
        server.setExecutor(threadPoolExecutor);
        server.start();
    }
}
