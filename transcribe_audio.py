#!/usr/bin/env python3
"""
Local Whisper transcription script
Monitors a folder for audio files and transcribes them to text
"""

import os
import sys
import whisper
from pathlib import Path
from datetime import datetime

# Configuration
AUDIO_FOLDER = os.path.expanduser("~/clawd/audio-to-transcribe")
OUTPUT_FOLDER = os.path.expanduser("~/clawd/transcripts")
MODEL = "base"  # Options: tiny, base, small, medium, large (base is ~140MB, good balance)

# Supported audio formats
AUDIO_FORMATS = {'.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'}

def ensure_folders():
    """Create folders if they don't exist"""
    os.makedirs(AUDIO_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def load_model():
    """Load Whisper model"""
    print(f"Loading Whisper {MODEL} model...")
    return whisper.load_model(MODEL)

def transcribe_file(model, audio_path):
    """Transcribe a single audio file"""
    print(f"Transcribing: {audio_path}")
    result = model.transcribe(str(audio_path))
    return result["text"]

def save_transcript(audio_filename, transcript):
    """Save transcript to file"""
    base_name = Path(audio_filename).stem
    output_file = os.path.join(OUTPUT_FOLDER, f"{base_name}_transcript.txt")
    
    with open(output_file, 'w') as f:
        f.write(f"Transcribed: {datetime.now().isoformat()}\n")
        f.write(f"Source: {audio_filename}\n")
        f.write("-" * 50 + "\n\n")
        f.write(transcript)
    
    print(f"Saved to: {output_file}")
    return output_file

def main():
    ensure_folders()
    model = load_model()
    
    print(f"Watching folder: {AUDIO_FOLDER}")
    print(f"Output folder: {OUTPUT_FOLDER}")
    print("Supported formats: " + ", ".join(AUDIO_FORMATS))
    print("\nReady. Drop audio files in the audio-to-transcribe folder.\n")
    
    # Process any existing files
    for audio_file in Path(AUDIO_FOLDER).iterdir():
        if audio_file.suffix.lower() in AUDIO_FORMATS:
            try:
                transcript = transcribe_file(model, audio_file)
                save_transcript(audio_file.name, transcript)
                # Move processed file to a "done" subfolder
                done_folder = os.path.join(AUDIO_FOLDER, "done")
                os.makedirs(done_folder, exist_ok=True)
                audio_file.rename(os.path.join(done_folder, audio_file.name))
            except Exception as e:
                print(f"Error processing {audio_file}: {e}")

if __name__ == "__main__":
    main()
