.PHONY: help install dev start clean test lint format

# Default target
help:
	@echo "MARIS Backend Development Commands"
	@echo ""
	@echo "install     Install dependencies with uv"
	@echo "dev         Start development server with uv"
	@echo "start       Start production server"
	@echo "test        Run tests with uv"
	@echo "lint        Run linting with ruff"
	@echo "format      Format code with black"
	@echo "clean       Clean cache files"

# Install dependencies
install:
	@echo "📦 Installing dependencies with uv..."
	uv sync

# Start development server
dev:
	@echo "🚀 Starting development server..."
	python main.py

# Start production server
start:
	@echo "🚀 Starting production server..."
	python -m uvicorn main:app --host 0.0.0.0 --port 5000

# Run tests
test:
	@echo "🧪 Running tests with uv..."
	uv run pytest

# Run linting
lint:
	@echo "🔍 Running linting with ruff..."
	uv run ruff check .

# Format code
format:
	@echo "✨ Formatting code with black..."
	uv run black .

# Install from requirements.txt (alternative method)
install-requirements:
	@echo "📦 Installing from requirements.txt with uv..."
	uv pip install -r requirements.txt

# Clean cache files
clean:
	@echo "🧹 Cleaning cache files..."
	rm -rf .pytest_cache
	rm -rf __pycache__
	rm -rf .ruff_cache
	rm -rf .coverage
	rm -rf htmlcov
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Install uv if not present
setup-uv:
	@echo "📦 Installing uv..."
	pip install uv

# Show environment info
info:
	@echo "📋 Environment Information:"
	@echo "Python: $(shell python --version)"
	@echo "uv: $(shell uv --version 2>/dev/null || echo 'not installed')"
	@echo "Working Directory: $(shell pwd)"
