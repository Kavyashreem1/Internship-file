def blob_callback(blob, metadata):
    secrets = [
        b"a27c9c84b5c18fa7a2544e955c6c9efa591602cd",
        b"f5f9df76d128fbd0885d0ba2ddba32b26739af4b",
        b"613bfb05960c69bf242ee986dfeceb5d092abe24",
        b"c50a4959bdc7131667ce1a6f359eebbe254d17d8"
    ]
    if blob.id in secrets:
        blob.data = b""
