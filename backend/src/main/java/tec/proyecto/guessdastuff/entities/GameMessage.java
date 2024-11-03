package tec.proyecto.guessdastuff.entities;

public class GameMessage {
    private String sender;
    private String content;
    private String type;

    // Getters y Setters
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
