import numpy as np
from scipy.io.wavfile import write
import simpleaudio as sa  #  install: pip install simpleaudio

def create_simple_beat(
    filename="simple_beat.wav",
    frequency=440,            
    duration=2,               
    volume=0.5,               
    sample_rate=44100,        
    add_heartbeat=False,
    add_wave=False
):
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    # Main melody (emotion tone)
    waveform = volume * np.sin(2 * np.pi * frequency * t)

    # Heartbeat (low bass pulse)
    if add_heartbeat:
        heartbeat_freq = 60  # 60 Hz
        heartbeat = 0.2 * np.sin(2 * np.pi * heartbeat_freq * t)
        waveform += heartbeat

    # Wave ambient (high smooth noise)
    if add_wave:
        noise = 0.05 * np.random.normal(0, 1, t.shape)
        waveform += noise

    # Clip the waveform to be safe
    waveform = np.clip(waveform, -1, 1)

    write(filename, sample_rate, np.int16(waveform * 32767))
    print(f"✨ Created '{filename}' successfully! 🎶✨")

    # Auto-play after creation
    play_wave(filename)

def play_wave(filename):
    try:
        wave_obj = sa.WaveObject.from_wave_file(filename)
        play_obj = wave_obj.play()
        play_obj.wait_done()
    except Exception as e:
        print(f"Could not play {filename}: {e}")

# 🌟 Here's where you create emotional beats
if __name__ == "__main__":
    create_simple_beat(filename="happy.wav", frequency=660, duration=3, volume=0.7, add_heartbeat=True, add_wave=True)
    create_simple_beat(filename="sad.wav", frequency=220, duration=4, volume=0.4, add_heartbeat=False, add_wave=True)
    create_simple_beat(filename="angry.wav", frequency=120, duration=2, volume=0.9, add_heartbeat=True, add_wave=False)
    create_simple_beat(filename="chill.wav", frequency=300, duration=5, volume=0.3, add_heartbeat=False, add_wave=True)
