package service;

import model.Task;
import repository.FileRepository;
import java.time.LocalDate;
import java.util.List;

public class TaskService {
    private final FileRepository fileRepository;

    public TaskService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public String getAllTasksJson() {
        List<Task> tasks = fileRepository.readTasks();
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < tasks.size(); i++) {
            sb.append("  ").append(tasks.get(i).toJson());
            if (i < tasks.size() - 1)
                sb.append(",");
            sb.append("\n");
        }
        sb.append("]");
        return sb.toString();
    }

    public Task addTask(String title, String description) {
        List<Task> tasks = fileRepository.readTasks();
        int maxId = 0;
        for (Task t : tasks) {
            if (t.getId() > maxId)
                maxId = t.getId();
        }
        Task task = new Task(maxId + 1, title, description, "pending", LocalDate.now().toString());
        tasks.add(task);
        fileRepository.writeTasks(tasks);
        return task;
    }

    public Task updateTask(int id, String title, String description, String status) {
        List<Task> tasks = fileRepository.readTasks();
        for (Task t : tasks) {
            if (t.getId() == id) {
                if (title != null)
                    t.setTitle(title);
                if (description != null)
                    t.setDescription(description);
                if (status != null)
                    t.setStatus(status);
                fileRepository.writeTasks(tasks);
                return t;
            }
        }
        return null;
    }

    public boolean deleteTask(int id) {
        List<Task> tasks = fileRepository.readTasks();
        boolean removed = tasks.removeIf(t -> t.getId() == id);
        if (removed) {
            fileRepository.writeTasks(tasks);
        }
        return removed;
    }
}
