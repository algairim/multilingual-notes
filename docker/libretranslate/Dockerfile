# Use a lightweight Python base image, suitable for machine learning dependencies
FROM python:3.11-slim

# Set environment variables for non-interactive commands
ENV PYTHONUNBUFFERED 1
ENV LT_PORT 5000

# Fix 1 (CPU Warnings): Suppress the non-fatal prctl(PR_SVE_GET_VL) failed warning and other low-level CPU logs.
# This variable is intended to silence C/C++ logging from the cpuinfo library.
ENV CPUI_LOGLEVEL 2

# Fix 2 (Python Warnings): Use this env var to suppress the PyTorch FutureWarnings on startup.
ENV PYTHONWARNINGS ignore::FutureWarning

# Install LibreTranslate and its dependencies
RUN pip install --no-cache-dir libretranslate

# Expose the default port
EXPOSE 5000

# FIX 3 (Main Error): Execute LibreTranslate directly as the installed script,
# NOT using 'python -m libretranslate' which causes the "No module named __main__" error.
# The executable path is often in /usr/local/bin/libretranslate.
CMD ["libretranslate", "--host", "0.0.0.0", "--port", "5000"]
