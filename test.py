# h264_mimetypes.py

# Common H.264 profiles with their hex values
profiles = {
    "Baseline": "42",
    "Main": "4D",
    "High": "64",
}

# Compatibility byte: often 0x00 or can be profile-dependent
compatibility_byte = "00"

# Common H.264 levels with their hex values
levels = {
    "1.0": "0A",
    "1.1": "0B",
    "1.2": "0C",
    "1.3": "0D",
    "2.0": "14",
    "2.1": "15",
    "2.2": "16",
    "3.0": "1E",
    "3.1": "1F",
    "3.2": "20",
    "4.0": "28",
    "4.1": "29",
    "4.2": "2A",
    "5.0": "32",
    "5.1": "33",
    "5.2": "34",
}

print("Generated MIME types:")
for profile_name, profile_hex in profiles.items():
    for level_name, level_hex in levels.items():
        codec_id = f"{profile_hex}{compatibility_byte}{level_hex}"
        mime = f'video/mp4; codecs="avc1.{codec_id}"'
        print(mime)

