package repository;

import model.Task;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

public class FileRepository {
    private final String filePath;

    public FileRepository() {
        String baseDir = new File(".").getAbsolutePath().replace("\\", "/");
        if (baseDir.endsWith("/backend") || baseDir.endsWith("/backend/.")) {
            filePath = "../data/tasks.json";
        } else if (baseDir.endsWith("/todo-app") || baseDir.endsWith("/todo-app/.")) {
            filePath = "data/tasks.json";
        } else {
            filePath = "data/tasks.json";
        }

        try {
            File file = new File(filePath);
            File dataDir = file.getParentFile();
            if (dataDir != null && !dataDir.exists()) {
                dataDir.mkdirs();
            }
            if (!file.exists()) {
                Files.write(Paths.get(filePath), "[]".getBytes());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<Task> readTasks() {
        List<Task> tasks = new ArrayList<>();
        try {
            String content = new String(Files.readAllBytes(Paths.get(filePath)));
            Pattern pattern = Pattern.compile(
                    "\\{\\s*\"id\"\\s*:\\s*(\\d+)\\s*,\\s*\"title\"\\s*:\\s*\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"\\s*,\\s*\"description\"\\s*:\\s*\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"\\s*,\\s*\"status\"\\s*:\\s*\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"\\s*,\\s*\"createdAt\"\\s*:\\s*\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"\\s*}");
            Matcher matcher = pattern.matcher(content);
            while (matcher.find()) {
                int id = Integer.parseInt(matcher.group(1));
                String title = unescapeJson(matcher.group(2));
                String description = unescapeJson(matcher.group(3));
                String status = unescapeJson(matcher.group(4));
                String createdAt = unescapeJson(matcher.group(5));
                tasks.add(new Task(id, title, description, status, createdAt));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return tasks;
    }

    public void writeTasks(List<Task> tasks) {
        try {
            StringBuilder sb = new StringBuilder("[\n");
            for (int i = 0; i < tasks.size(); i++) {
                sb.append("  ").append(tasks.get(i).toJson());
                if (i < tasks.size() - 1)
                    sb.append(",");
                sb.append("\n");
            }
            sb.append("]");
            Files.write(Paths.get(filePath), sb.toString().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String unescapeJson(String s) {
        if (s == null)
            return null;
        return s.replace("\\\"", "\"").replace("\\n", "\n").replace("\\r", "\r").replace("\\\\", "\\");
    }
}
