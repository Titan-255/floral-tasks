package model;

public class Task {
    private int id;
    private String title;
    private String description;
    private String status;
    private String createdAt;

    public Task() {}

    public Task(int id, String title, String description, String status, String createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String toJson() {
        return "{" +
                "\"id\":" + id + "," +
                "\"title\":\"" + escapeJson(title) + "\"," +
                "\"description\":\"" + escapeJson(description) + "\"," +
                "\"status\":\"" + escapeJson(status) + "\"," +
                "\"createdAt\":\"" + escapeJson(createdAt) + "\"" +
                "}";
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
