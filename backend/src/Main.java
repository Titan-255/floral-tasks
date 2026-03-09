import com.sun.net.httpserver.HttpServer;
import controller.TaskController;
import repository.FileRepository;
import service.TaskService;
import java.net.InetSocketAddress;
import java.io.File;

public class Main {
    public static void main(String[] args) throws Exception {
        FileRepository fileRepository = new FileRepository();
        TaskService taskService = new TaskService(fileRepository);
        TaskController taskController = new TaskController(taskService);

        String portEnv = System.getenv("PORT");
        int port = (portEnv != null) ? Integer.parseInt(portEnv) : 8080;

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/tasks", taskController);

        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/"))
                path = "/index.html";

            String baseDir = new File(".").getAbsolutePath().replace("\\", "/");
            String frontendDir = (baseDir.endsWith("/backend") || baseDir.endsWith("/backend/.")) ? "../frontend"
                    : "frontend";
            if (baseDir.endsWith("/src") || baseDir.endsWith("/src/."))
                frontendDir = "../../frontend";

            File file = new File(frontendDir + path);
            if (!file.exists() || file.isDirectory()) {
                String response = "404 Not Found";
                exchange.sendResponseHeaders(404, response.length());
                java.io.OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }
            byte[] bytes = java.nio.file.Files.readAllBytes(file.toPath());
            String mime = "text/plain";
            if (path.endsWith(".html"))
                mime = "text/html";
            else if (path.endsWith(".css"))
                mime = "text/css";
            else if (path.endsWith(".js"))
                mime = "application/javascript";
            else if (path.endsWith(".json"))
                mime = "application/json";

            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.sendResponseHeaders(200, bytes.length);
            java.io.OutputStream os = exchange.getResponseBody();
            os.write(bytes);
            os.close();
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Server started on http://localhost:8080");
        System.out.println("Visit http://localhost:8080/ to view the application.");
    }
}
