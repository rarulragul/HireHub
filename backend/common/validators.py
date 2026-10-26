import os
from django.core.exceptions import ValidationError
from django.conf import settings

def validate_resume_file(file):
    max_size = getattr(settings, 'MAX_RESUME_SIZE_MB', 5) * 1024 * 1024
    if file.size > max_size:
        raise ValidationError(f"File size must not exceed {getattr(settings, 'MAX_RESUME_SIZE_MB', 5)} MB.")

    ext = os.path.splitext(file.name)[1].lower()
    allowed_extensions = getattr(settings, 'ALLOWED_RESUME_EXTENSIONS', ['.pdf'])
    if ext not in allowed_extensions:
        raise ValidationError(f"Unsupported file format '{ext}'. Allowed format is PDF only.")

    # Check magic bytes for PDF (%PDF-)
    file.seek(0)
    header = file.read(5)
    file.seek(0)
    if header != b'%PDF-':
        raise ValidationError("Invalid PDF file. The file content does not match a valid PDF header.")
