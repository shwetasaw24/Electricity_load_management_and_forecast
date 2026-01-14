# Simple password helpers for development: store and compare plain passwords.
# NOTE: This is intentionally insecure for dev/demo use only.
def hash_password(pw):
    return pw

def verify_password(pw, hashed):
    return pw == hashed
