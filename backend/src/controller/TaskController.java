package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.Task;
import service.TaskService;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.regex.*;

public class TaskController implements HttpHandler {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        // CORS Headers
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        try {
            if ("GET".equalsIgnoreCase(method) && path.equals("/tasks")) {
                handleGetTasks(exchange);
            } else if ("POST".equalsIgnoreCase(method) && path.equals("/tasks")) {
                handlePostTask(exchange);
            } else if ("PUT".equalsIgnoreCase(method) && path.matches("/tasks/\\d+")) {
                handlePutTask(exchange, Integer.parseInt(path.substring("/tasks/".length())));
            } else if ("DELETE".equalsIgnoreCase(method) && path.matches("/tasks/\\d+")) {
                handleDeleteTask(exchange, Integer.parseInt(path.substring("/tasks/".length())));
            } else {
                sendResponse(exchange, 404, "Not Found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "Internal Server Error");
        }
    }

    private void handleGetTasks(HttpExchange exchange) throws IOException {
        String json = taskService.getAllTasksJson();
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        sendResponse(exchange, 200, json);
    }

    private void handlePostTask(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        String title = extractJsonString(body, "title");
        String description = extractJsonString(body, "description");

        Task newTask = taskService.addTask(title, description);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        sendResponse(exchange, 201, newTask.toJson());
    }

    private void handlePutTask(HttpExchange exchange, int id) throws IOException {
        String body = readBody(exchange);
        String title = extractJsonString(body, "title");
        String description = extractJsonString(body, "description");
        String status = extractJsonString(body, "status");

        Task updatedTask = taskService.updateTask(id, title, description, status);
        if (updatedTask != null) {
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            sendResponse(exchange, 200, updatedTask.toJson());
        } else {
            sendResponse(exchange, 404, "Task Not Found");
        }
    }

    private void handleDeleteTask(HttpExchange exchange, int id) throws IOException {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            sendResponse(exchange, 204, "");
        } else {
            sendResponse(exchange, 404, "Task Not Found");
        }
    }

    private String readBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[1024];
        while ((nRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        buffer.flush();
        return new String(buffer.toByteArray(), StandardCharsets.UTF_8);
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        if (bytes.length > 0)
            os.write(bytes);
        os.close();
    }

    private String extractJsonString(String json, String key) {
        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return unescapeJson(matcher.group(1));
        }
        return null;
    }

    private String unescapeJson(String s) {
        if (s == null)
            return null;
        return s.replace("\\\"", "\"").replace("\\n", "\n").replace("\\r", "\r").replace("\\\\", "\\");
    }
}
