import os
import time
import librosa
import numpy as np

# Terminal color codes for emotions
emotion_colors = {
    "happy": "\033[93m",    # Yellow
    "sad": "\033[94m",      # Blue
    "angry": "\033[91m",    # Red
    "relaxed": "\033[92m",  # Green
    "excited": "\033[95m",  # Purple
    "reset": "\033[0m"      # Reset
}

def predict_emotion(file_path):
    y, sr = librosa.load(file_path)

    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    energy = np.sum(np.abs(y)) / len(y)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_variation = pitches.std()

    if energy > 0.05 and tempo > 140:
        return "excited"
    elif energy < 0.02 and tempo < 80:
        return "sad"
    elif energy > 0.04 and pitch_variation > 20:
        return "happy"
    elif energy > 0.06 and pitch_variation < 5:
        return "angry"
    else:
        return "relaxed"

def visualize_sound(y, emotion):
    color = emotion_colors.get(emotion, emotion_colors["reset"])
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear terminal screen

    print(f"{color}Emotion Detected: {emotion.upper()}{emotion_colors['reset']}\n")
    print("Sound Visualizer (Press CTRL+C to stop)\n")

    try:
        for i in range(200):  # Loop over 200 frames
            bar = int(np.random.choice(np.abs(y)) * 50)
            print(color + "█" * bar + emotion_colors['reset'])
            time.sleep(0.05)
    except KeyboardInterrupt:
        print("\nVisualization stopped.")

def main():
    print("Welcome to Terminal Emotion Audio Visualizer 🎶✨")
    file_path = input("Enter the path to your audio file (wav/mp3): ")

    if not os.path.isfile(file_path):
        print("File not found. Please check the path and try again.")
        return

    print("\nAnalyzing your audio...")
    emotion = predict_emotion(file_path)

    y, sr = librosa.load(file_path)
    visualize_sound(y, emotion)

if __name__ == "__main__":
    main()
