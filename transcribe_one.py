#!/usr/bin/env python3
"""
Transcribe a single audio file using local Whisper
"""

import whisper
import sys
from pathlib import Path

def transcribe_file(audio_path, model_name="base"):
    """Transcribe a single audio file"""
    print(f"Loading Whisper model: {model_name}")
    model = whisper.load_model(model_name)
    
    print(f"Transcribing: {audio_path}")
    result = model.transcribe(str(audio_path))
    return result["text"]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <audio_file> [model_name]")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    model_name = sys.argv[2] if len(sys.argv) > 2 else "base"
    
    if not Path(audio_file).exists():
        print(f"Error: File not found: {audio_file}")
        sys.exit(1)
    
    try:
        transcript = transcribe_file(audio_file, model_name)
        print("\n" + "="*60)
        print("TRANSCRIPT:")
        print("="*60)
        print(transcript)
    except Exception as e:
        print(f"Transcription error: {e}")
        sys.exit(1)