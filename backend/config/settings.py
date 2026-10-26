import os
from pathlib import Path
from datetime import timedelta
import pymysql
from dotenv import load_dotenv

pymysql.install_as_MySQLdb()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file (local dev only; Render uses env vars directly)
load_dotenv(BASE_DIR / '.env')

# SECURITY: Read from env. Never hardcode in production.
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-hirehub-recruitment-portal-secret-key-2026-local-dev-only')

# DEBUG must be False in production. Render sets DEBUG=False via environment variable.
DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 'yes')

# -----------------------------------------------------------------------
# ALLOWED_HOSTS — set your Render backend URL here via env var
# -----------------------------------------------------------------------
_ALLOWED_HOSTS_ENV = os.getenv('ALLOWED_HOSTS', '')
if _ALLOWED_HOSTS_ENV:
    ALLOWED_HOSTS = [h.strip() for h in _ALLOWED_HOSTS_ENV.split(',') if h.strip()]
else:
    # Fallback for local development only
    ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party packages
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'whitenoise.runserver_nostatic',  # Serves static files with WhiteNoise even in dev

    # Local apps
    'accounts.apps.AccountsConfig',
    'candidates.apps.CandidatesConfig',
    'recruiters.apps.RecruitersConfig',
    'jobs.apps.JobsConfig',
    'applications.apps.ApplicationsConfig',
    'dashboard.apps.DashboardConfig',
    'common.apps.CommonConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Serve static files efficiently
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# -----------------------------------------------------------------------
# Database Configuration — MySQL 8
# -----------------------------------------------------------------------
# On Render, set all DB_* environment variables in the service's environment.
# USE_SQLITE is only for local development fallback when MySQL is not available.
DB_NAME = os.getenv('DB_NAME', 'hirehub_db')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = os.getenv('DB_PORT', '3306')
FORCE_SQLITE = os.getenv('USE_SQLITE', 'False').lower() in ('true', '1', 'yes')

# In production (DEBUG=False), ALWAYS use MySQL. Never fall back to SQLite silently.
if not DEBUG and not FORCE_SQLITE:
    # Production: require MySQL — fail loudly if credentials are wrong.
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
            'OPTIONS': {
                'charset': 'utf8mb4',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
            'CONN_MAX_AGE': 60,  # Persistent connections for performance
        }
    }
else:
    # Development: try MySQL, fall back to SQLite if MySQL unavailable
    def _try_mysql_connection():
        if FORCE_SQLITE:
            return False
        try:
            conn = pymysql.connect(
                host=DB_HOST,
                port=int(DB_PORT),
                user=DB_USER,
                password=DB_PASSWORD,
                connect_timeout=2
            )
            with conn.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            conn.close()
            return True
        except Exception as exc:
            print(f"[HireHub DB Config] MySQL connection failed ({DB_USER}@{DB_HOST}:{DB_PORT}): {exc}")
            print("[HireHub DB Config] Falling back to SQLite for local dev. Update backend/.env to connect to MySQL.")
            return False

    if _try_mysql_connection():
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.mysql',
                'NAME': DB_NAME,
                'USER': DB_USER,
                'PASSWORD': DB_PASSWORD,
                'HOST': DB_HOST,
                'PORT': DB_PORT,
                'OPTIONS': {
                    'charset': 'utf8mb4',
                    'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
                }
            }
        }
    else:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 6}
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -----------------------------------------------------------------------
# Static files — served by WhiteNoise in production
# -----------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# -----------------------------------------------------------------------
# Media files (Resumes, attachments)
# In production on Render, uploaded files live in /tmp/media or a
# persistent disk if you add one. Adjust MEDIA_ROOT via env var.
# -----------------------------------------------------------------------
MEDIA_URL = '/media/'
MEDIA_ROOT = Path(os.getenv('MEDIA_ROOT', str(BASE_DIR.parent / 'media')))

# File upload restrictions
MAX_RESUME_SIZE_MB = int(os.getenv('MAX_RESUME_SIZE_MB', '5'))
ALLOWED_RESUME_EXTENSIONS = ['.pdf']

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -----------------------------------------------------------------------
# Django REST Framework Configuration
# -----------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'common.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 10,
    'EXCEPTION_HANDLER': 'common.exceptions.custom_exception_handler',
}

# -----------------------------------------------------------------------
# Simple JWT Configuration
# -----------------------------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# -----------------------------------------------------------------------
# CORS Configuration
# -----------------------------------------------------------------------
_CORS_ORIGINS_ENV = os.getenv('CORS_ALLOWED_ORIGINS', '')
if _CORS_ORIGINS_ENV:
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _CORS_ORIGINS_ENV.split(',') if o.strip()]
    CORS_ALLOW_ALL_ORIGINS = False
else:
    # Local dev: allow all origins (never in production)
    CORS_ALLOW_ALL_ORIGINS = DEBUG  # True in dev, False in prod if no env var set
    if not DEBUG:
        # Safety net: if no CORS_ALLOWED_ORIGINS set in production, deny all cross-origin
        CORS_ALLOWED_ORIGINS = []

CORS_ALLOW_CREDENTIALS = True

# -----------------------------------------------------------------------
# CSRF Trusted Origins — required when DEBUG=False
# -----------------------------------------------------------------------
_CSRF_ORIGINS_ENV = os.getenv('CSRF_TRUSTED_ORIGINS', '')
if _CSRF_ORIGINS_ENV:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in _CSRF_ORIGINS_ENV.split(',') if o.strip()]
else:
    CSRF_TRUSTED_ORIGINS = []

# -----------------------------------------------------------------------
# Production Security Settings (only active when DEBUG=False)
# -----------------------------------------------------------------------
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = False  # Render handles SSL termination at the load balancer
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
