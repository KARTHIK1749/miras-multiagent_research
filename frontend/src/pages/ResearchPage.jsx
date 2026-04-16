import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Play, StepForward, Loader2 } from 'lucide-react'

const ResearchPage = () => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [executionMode, setExecutionMode] = useState('full')
  const navigate = useNavigate()

  const handleStartResearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/research/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          full_execution: executionMode === 'full'
        })
      })

      if (!response.ok) throw new Error('Failed to start research')

      const data = await response.json()
      
      if (executionMode === 'full') {
        // Navigate to workflow page to monitor progress
        navigate(`/workflow/${data.research_id}`)
      } else {
        // Navigate to workflow page for step-by-step execution
        navigate(`/workflow/${data.research_id}`)
      }
    } catch (error) {
      console.error('Error starting research:', error)
      alert('Failed to start research. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sampleQueries = [
    'machine learning interpretability techniques',
    'quantum computing applications in cryptography',
    'climate change impact on biodiversity',
    'renewable energy storage solutions',
    'artificial intelligence in healthcare diagnostics'
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Start Your Research
        </h1>
        <p className="text-lg text-gray-600">
          Enter your research query and let MARIS agents work together to provide comprehensive insights
        </p>
      </div>

      {/* Main Input Form */}
      <div className="card space-y-6">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Research Query
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your research question or topic..."
            className="input min-h-[120px] resize-none"
            rows={4}
          />
        </div>

        {/* Execution Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Execution Mode
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="full"
                checked={executionMode === 'full'}
                onChange={(e) => setExecutionMode(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">
                <strong>Full Execution</strong> - Run complete workflow automatically
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="step"
                checked={executionMode === 'step'}
                onChange={(e) => setExecutionMode(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">
                <strong>Step-by-Step</strong> - Control each step manually
              </span>
            </label>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartResearch}
          disabled={loading || !query.trim()}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Starting Research...
            </>
          ) : (
            <>
              {executionMode === 'full' ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Full Research
                </>
              ) : (
                <>
                  <StepForward className="h-4 w-4 mr-2" />
                  Start Step-by-Step
                </>
              )}
            </>
          )}
        </button>
      </div>

      {/* Sample Queries */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sample Research Queries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleQueries.map((sampleQuery, index) => (
            <button
              key={index}
              onClick={() => setQuery(sampleQuery)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
            >
              <Search className="h-4 w-4 inline mr-2 text-gray-500" />
              {sampleQuery}
            </button>
          ))}
        </div>
      </div>

      {/* Research Workflow Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          What Happens Next?
        </h2>
        <div className="space-y-3">
          {[
            {
              step: '1. Query Optimization',
              description: 'Meta Agent analyzes and optimizes your research query'
            },
            {
              step: '2. Parallel Research',
              description: 'Literature and Web agents search simultaneously'
            },
            {
              step: '3. Gap Analysis',
              description: 'Gap Agent identifies research opportunities'
            },
            {
              step: '4. Experiment Design',
              description: 'Experiment Agent creates testable hypotheses'
            },
            {
              step: '5. Dataset Recommendations',
              description: 'Dataset Agent suggests relevant data sources'
            },
            {
              step: '6. RIS Scoring',
              description: 'RIS Agent evaluates research potential'
            },
            {
              step: '7. Reflection',
              description: 'Reflection Agent provides quality assessment'
            },
            {
              step: '8. Final Report',
              description: 'Comprehensive research report with all findings'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{item.step}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResearchPage
