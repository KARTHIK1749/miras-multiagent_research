import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Download, FileText, Search, Database, Lightbulb, Beaker,
  Target, MessageSquare, BarChart, ExternalLink, Clock,
  CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react'

const ResultsPage = () => {
  const { researchId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!researchId) {
      navigate('/research')
      return
    }

    fetchResults()
  }, [researchId, navigate])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/research/${researchId}/results`)
      if (!response.ok) throw new Error('Failed to fetch results')
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportResults = async (format) => {
    if (!results) return

    if (format === 'json') {
      const dataStr = JSON.stringify(results, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `maris-research-${results.research_id}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // For PDF export, you would need a backend endpoint or client-side library
      alert('PDF export coming soon!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 h-8 w-8"></div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Results Not Found</h2>
        <p className="text-gray-600 mb-4">The research results could not be found.</p>
        <button onClick={() => navigate('/research')} className="btn btn-primary">
          Start New Research
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'literature', label: 'Literature', icon: Search },
    { id: 'gaps', label: 'Research Gaps', icon: Lightbulb },
    { id: 'hypotheses', label: 'Hypotheses', icon: Beaker },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'ris', label: 'RIS Score', icon: Target },
    { id: 'reflection', label: 'Reflection', icon: MessageSquare }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/research')}
              className="btn btn-outline flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Research Results</h1>
              <p className="text-gray-600">Research ID: {researchId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportResults('json')}
              className="btn btn-outline flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </button>
            <button
              onClick={() => exportResults('pdf')}
              className="btn btn-outline flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Execution Time</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(results.execution_time)}s
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Status</span>
            </div>
            <div className="text-lg font-semibold text-green-600 capitalize">
              {results.status}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Target className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">RIS Score</span>
            </div>
            <div className="text-lg font-semibold text-primary-600">
              {results.ris_score.final_score}/100
            </div>
          </div>
        </div>

        {/* Queries */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Original Query:</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{results.original_query}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Optimized Query:</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{results.optimized_query}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Plan</h3>
              <ol className="space-y-2">
                {results.research_plan.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Research Output</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• {results.literature_results.length} literature sources</li>
                    <li>• {results.web_results.length} web resources</li>
                    <li>• {results.gaps_identified.length} research gaps</li>
                    <li>• {results.hypotheses.length} hypotheses</li>
                    <li>• {results.suggested_datasets.length} datasets</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Novelty</span>
                      <span className="text-sm font-medium">{results.ris_score.novelty}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Feasibility</span>
                      <span className="text-sm font-medium">{results.ris_score.feasibility}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Impact</span>
                      <span className="text-sm font-medium">{results.ris_score.impact}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Risk</span>
                      <span className="text-sm font-medium">{results.ris_score.risk}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Literature Tab */}
        {activeTab === 'literature' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Literature Sources</h3>
            <div className="space-y-4">
              {results.literature_results.map((paper, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{paper.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{paper.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {paper.source} • {paper.year}
                    </div>
                    {paper.url && (
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Gaps Tab */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Identified Research Gaps</h3>
            <div className="space-y-3">
              {results.gaps_identified.map((gap, index) => (
                <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{gap}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hypotheses Tab */}
        {activeTab === 'hypotheses' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Research Hypotheses</h3>
            <div className="space-y-3">
              {results.hypotheses.map((hypothesis, index) => (
                <div key={index} className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    H{index + 1}
                  </div>
                  <p className="text-gray-700">{hypothesis}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Datasets Tab */}
        {activeTab === 'datasets' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recommended Datasets</h3>
            <div className="space-y-4">
              {results.suggested_datasets.map((dataset, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{dataset.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{dataset.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {dataset.source} • {dataset.format}
                    </div>
                    {dataset.url && (
                      <a
                        href={dataset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Access
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIS Score Tab */}
        {activeTab === 'ris' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Research Impact Score</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {results.ris_score.novelty}
                </div>
                <div className="text-sm text-gray-600">Novelty</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {results.ris_score.feasibility}
                </div>
                <div className="text-sm text-gray-600">Feasibility</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {results.ris_score.impact}
                </div>
                <div className="text-sm text-gray-600">Impact</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {results.ris_score.final_score}
                </div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Assessment Reasoning</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {results.ris_score.reasoning}
              </p>
            </div>
          </div>
        )}

        {/* Reflection Tab */}
        {activeTab === 'reflection' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Research Reflection</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {results.reflection}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage
