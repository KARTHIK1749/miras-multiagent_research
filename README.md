# MARIS - Multi-Agent Research Intelligence System

A production-grade autonomous research pipeline that uses multiple specialized AI agents orchestrated via LangGraph to perform end-to-end research with structured reasoning and stateful execution.

## 🧠 Overview

MARIS is **NOT** a chatbot. It's an autonomous research system that:

- Optimizes research queries using the Meta Agent
- Performs parallel literature and web searches
- Identifies research gaps through clustering analysis
- Generates testable hypotheses and experimental designs
- Recommends relevant datasets and methodologies
- Scores research potential using the RIS (Research Impact Score) system
- Provides comprehensive reflection and quality assessment

## 🏗️ Architecture

### Backend (Python + FastAPI)
- **FastAPI**: RESTful API framework
- **LangGraph**: Agent orchestration and workflow management
- **Groq API**: LLM integration (Llama-3.3-70B-Versatile)
- **FAISS**: Vector database for semantic search and memory
- **Multiple Search APIs**: arXiv, Semantic Scholar, Tavily, Serp

### Frontend (React + TypeScript)
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Axios**: HTTP client
- **React Router**: Navigation

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- API keys (see configuration below)
- uv (recommended) or pip for Python package management

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MARIS-MVSR
   ```

2. **Install Python dependencies (using uv - recommended):**
   ```bash
   cd backend
   # Install uv if not already installed
   pip install uv
   
   # Install dependencies with uv
   uv sync
   ```

   **Or using uv with requirements.txt:**
   ```bash
   cd backend
   uv pip install -r requirements.txt
   ```

   **Or using pip (traditional):**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 4. Start Backend Server

**Using uv (recommended):**
```bash
uv run python main.py
```

**Using traditional Python:**
```bash
python main.py
```

Backend will be available at `http://localhost:5000`

### 4. Setup Frontend
```bash
cd frontend
npm install
```

### 5. Start Frontend Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:8173`

## 🔧 Configuration

### Required API Keys

Create a `.env` file in the `backend` directory:

```env
# Groq API (Required)
GROQ_API_KEY=your_groq_api_key_here

# Search APIs
TAVILY_API_KEY=your_tavily_api_key_here
OPENALEX_API_KEY=your_openalex_api_key_here

# arXiv API (no key required)
ARXIV_API_ENABLED=True

# Vector Database
VECTOR_DB_PATH=./data/vectors
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

### API Key Setup

1. **Groq API**: Get your key at [https://console.groq.com/](https://console.groq.com/)
2. **Tavily API**: Get your key at [https://tavily.com/](https://tavily.com/)
3. **OpenAlex API**: Optional, can be used without a key for basic usage
4. **arXiv API**: No API key required - completely free

## 🧩 Core Components

### Agents (8 Specialized Modules)

1. **Meta Agent**: Optimizes research queries and creates research plans
2. **Literature Agent**: Finds academic papers from arXiv and OpenAlex
3. **Web Research Agent**: Searches web resources using Tavily
4. **Gap Agent**: Identifies research gaps through clustering analysis
5. **Experiment Agent**: Generates hypotheses and experimental methodologies
6. **Dataset Agent**: Recommends relevant datasets and data sources
7. **Reflection Agent**: Provides quality assessment and critique
8. **RIS Agent**: Scores research on novelty, feasibility, impact, and risk

### LangGraph Workflow

```
Research Query
    ↓
Meta Agent (Query Optimization)
    ↓
Parallel Research (Literature + Web)
    ↓
Gap Analysis
    ↓
Experiment Design
    ↓
Dataset Recommendations
    ↓
RIS Scoring
    ↓
Reflection
    ↓
Final Report
```

### Memory System

- **FAISS Vector Database**: Stores research embeddings for semantic search
- **Persistent Storage**: Saves all research sessions with metadata
- **Semantic Search**: Find similar past research using natural language

## 📊 RIS Scoring System

The Research Impact Score evaluates research on four dimensions:

- **Novelty** (0-100): How original and innovative is the research?
- **Feasibility** (0-100): How realistic and achievable is the research?
- **Impact** (0-100): What is the potential significance and contribution?
- **Risk** (0-100): What are the potential challenges and limitations?

**Final Score**: Weighted average of all four dimensions

## 🌐 API Endpoints

### Research
- `POST /research/start` - Start new research session
- `POST /research/step` - Execute single research step
- `GET /research/{id}` - Get research status
- `POST /research/full` - Run complete research workflow
- `DELETE /research/{id}` - Delete research session

### Search
- `GET /search` - Perform unified search
- `POST /search` - Advanced search with parameters
- `GET /search/sources` - Get available search sources

### History
- `GET /history` - Get research history
- `GET /history/{id}` - Get specific research entry
- `POST /history/search` - Semantic search in memory
- `DELETE /history/{id}` - Delete research entry

## 🎨 Frontend Features

### Pages
1. **Home**: Project overview and introduction
2. **Research Input**: Start new research with query input
3. **Live Workflow**: Real-time visualization of agent execution
4. **Results**: Detailed research results with tabbed interface
5. **History**: Browse and search past research sessions

### Key Features
- **Real-time Progress**: Live updates during research execution
- **Step-by-Step Control**: Execute workflow manually or automatically
- **Interactive Visualizations**: RIS scores, progress bars, agent status
- **Export Functionality**: Download results as JSON
- **Semantic Search**: Find past research using natural language
- **Responsive Design**: Works on desktop and mobile devices

## 🔍 Sample Research Query

Try this sample query to test MARIS:

```
"machine learning interpretability techniques for healthcare applications"
```

This will demonstrate:
- Query optimization and planning
- Academic paper discovery
- Web resource gathering
- Gap identification
- Hypothesis generation
- Dataset recommendations
- RIS scoring
- Comprehensive reflection

## 📁 Project Structure

```
MARIS-MVSR/
├── backend/
│   ├── agents/           # Individual agent modules
│   ├── services/         # LLM, search, and memory services
│   ├── graph/           # LangGraph workflow
│   ├── routes/          # API endpoints
│   ├── models/          # Data models
│   └── main.py          # FastAPI application
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Development

### Backend Development

**Using uv (recommended):**
```bash
cd backend
make dev          # Start development server
make install      # Install dependencies
make test         # Run tests
make lint         # Run linting
make format       # Format code
```

**Using traditional commands:**
```bash
cd backend
uv run python main.py    # Start with uv
python main.py           # Start with system Python
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend (use production server like gunicorn)
cd backend
pip install gunicorn
gunicorn main:app --workers 4 --bind 0.0.0.0:8000
```

## 🔒 Security Notes

- Keep API keys secure and never commit them to version control
- Use environment variables for all sensitive configuration
- The system stores research data locally in the vector database
- Consider additional security measures for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all required API keys are set in `.env`
2. **Import Errors**: Make sure all dependencies are installed
3. **Memory Issues**: Check disk space for vector database
4. **Search Failures**: Verify API key validity and network connectivity

### Debug Mode

Enable debug logging by setting `DEBUG=True` in `.env`

## 📈 Performance

- **Typical Research Time**: 2-5 minutes for full workflow
- **Memory Usage**: ~500MB for vector database
- **Concurrent Users**: Supports multiple simultaneous research sessions
- **Search Limits**: Configurable via API parameters

## 🚀 Future Enhancements

- PDF export functionality
- Additional search sources
- Advanced visualization charts
- Collaboration features
- Research template system
- Integration with academic databases
- Automated citation generation
