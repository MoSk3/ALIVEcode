import com.sun.net.httpserver.*;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class Server {
    static final int PORT = 8001;

    public static void main(String[] args) throws IOException, NoSuchAlgorithmException {
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", PORT), 2);
        AliveScriptApi aliveScriptApi = new AliveScriptApi();
        HttpContext context = server.createContext("/compile/");

        context.setHandler(aliveScriptApi);

        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
        server.setExecutor(threadPoolExecutor);
        server.start();
    }
}
