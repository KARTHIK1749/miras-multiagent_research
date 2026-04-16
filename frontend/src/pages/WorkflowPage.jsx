import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Brain, Search, Globe, Lightbulb, Beaker, Database, 
  Target, MessageSquare, CheckCircle, Clock, AlertCircle,
  Play, StepForward, Loader2, ArrowRight
} from 'lucide-react'

const WorkflowPage = () => {
  const { researchId } = useParams()
  const navigate = useNavigate()
  const [researchState, setResearchState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)

  const workflowSteps = [
    { name: 'meta', label: 'Query Optimization', icon: Brain, description: 'Meta Agent analyzes and optimizes the research query' },
    { name: 'parallel_research', label: 'Parallel Research', icon: Search, description: 'Literature and Web agents search simultaneously' },
    { name: 'gap_analysis', label: 'Gap Analysis', icon: Lightbulb, description: 'Gap Agent identifies research opportunities' },
    { name: 'experiment_design', label: 'Experiment Design', icon: Beaker, description: 'Experiment Agent creates testable hypotheses' },
    { name: 'dataset_recommendation', label: 'Dataset Recommendations', icon: Database, description: 'Dataset Agent suggests relevant data sources' },
    { name: 'ris_scoring', label: 'RIS Scoring', icon: Target, description: 'RIS Agent evaluates research potential' },
    { name: 'reflection', label: 'Reflection', icon: MessageSquare, description: 'Reflection Agent provides quality assessment' },
    { name: 'finalize', label: 'Final Report', icon: CheckCircle, description: 'Comprehensive research report compilation' }
  ]

  const fetchResearchStatus = async () => {
    try {
      const response = await fetch(`/api/research/${researchId}`)
      if (!response.ok) throw new Error('Failed to fetch research status')
      
      const data = await response.json()
      setResearchState(data)
      
      if (data.status === 'completed') {
        setPolling(false)
        setLoading(false)
      } else if (data.status === 'failed') {
        setPolling(false)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching research status:', error)
      setPolling(false)
      setLoading(false)
    }
  }

  const executeNextStep = async () => {
    if (!researchState) return
    
    try {
      const response = await fetch('/api/research/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          research_id: researchId,
          step_name: undefined // Let server determine next step
        })
      })

      if (!response.ok) throw new Error('Failed to execute step')
      
      await fetchResearchStatus()
    } catch (error) {
      console.error('Error executing step:', error)
      alert('Failed to execute step. Please try again.')
    }
  }

  useEffect(() => {
    if (!researchId) {
      navigate('/research')
      return
    }

    fetchResearchStatus()
    setPolling(true)
  }, [researchId, navigate])

  useEffect(() => {
    if (!polling) return

    const interval = setInterval(fetchResearchStatus, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [polling])

  const getStepStatus = (stepName) => {
    if (!researchState) return 'pending'
    
    if (researchState.completed_steps.includes(stepName) || researchState.current_step === stepName) {
      if (researchState.current_step === stepName && researchState.status === 'running') {
        return 'running'
      }
      return 'completed'
    }
    
    return 'pending'
  }

  const getStepIcon = (step) => {
    const Icon = step.icon
    const status = getStepStatus(step.name)
    
    const iconClass = status === 'running' ? 'animate-pulse' : ''
    
    return (
      <div className={`p-3 rounded-full ${iconClass}`}>
        <Icon className={`h-6 w-6 ${
          status === 'completed' ? 'text-green-600' :
          status === 'running' ? 'text-primary-600' :
          'text-gray-400'
        }`} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    )
  }

  if (!researchState) {
    return (
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Research Not Found</h2>
        <p className="text-gray-600 mb-4">The research session could not be found.</p>
        <button onClick={() => navigate('/research')} className="btn btn-primary">
          Start New Research
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Workflow</h1>
            <p className="text-gray-600 mt-1">Research ID: {researchId}</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              researchState.status === 'completed' ? 'bg-green-100 text-green-800' :
              researchState.status === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {researchState.status === 'completed' && <CheckCircle className="h-4 w-4 mr-1" />}
              {researchState.status === 'failed' && <AlertCircle className="h-4 w-4 mr-1" />}
              {researchState.status === 'running' && <Clock className="h-4 w-4 mr-1 animate-pulse" />}
              {researchState.status}
            </div>
            {researchState.execution_time && (
              <p className="text-sm text-gray-500 mt-1">
                Execution time: {Math.round(researchState.execution_time)}s
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${researchState.progress || 0}%` }}
          />
        </div>

        {/* Original Query */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Original Query:</h3>
          <p className="text-gray-700">{researchState.original_query}</p>
          {researchState.optimized_query && (
            <>
              <h3 className="font-medium text-gray-900 mb-2 mt-3">Optimized Query:</h3>
              <p className="text-gray-700">{researchState.optimized_query}</p>
            </>
          )}
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Workflow Steps</h2>
        
        <div className="space-y-6">
          {workflowSteps.map((step, index) => {
            const status = getStepStatus(step.name)
            const isCurrent = researchState.current_step === step.name
            
            return (
              <div key={step.name} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getStepIcon(step)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-medium ${
                      status === 'completed' ? 'text-green-700' :
                      status === 'running' ? 'text-primary-700' :
                      'text-gray-500'
                    }`}>
                      {step.label}
                    </h3>
                    {isCurrent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1 animate-pulse" />
                        Running
                      </span>
                    )}
                    {status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  
                  {isCurrent && researchState.status !== 'completed' && (
                    <button
                      onClick={executeNextStep}
                      className="btn btn-primary btn-sm flex items-center"
                    >
                      {researchState.status === 'running' ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <StepForward className="h-4 w-4 mr-2" />
                          Execute Next Step
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Connection Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    <ArrowRight className={`h-4 w-4 ${
                      status === 'completed' ? 'text-green-600' :
                      status === 'running' ? 'text-primary-600' :
                      'text-gray-400'
                    }`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* RIS Score */}
      {researchState.ris_score && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Research Impact Score</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {researchState.ris_score.novelty}
              </div>
              <div className="text-sm text-gray-600">Novelty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {researchState.ris_score.feasibility}
              </div>
              <div className="text-sm text-gray-600">Feasibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {researchState.ris_score.impact}
              </div>
              <div className="text-sm text-gray-600">Impact</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {researchState.ris_score.final_score}
              </div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {researchState.errors && researchState.errors.length > 0 && (
        <div className="card border-red-200 bg-red-50">
          <h2 className="text-xl font-bold text-red-900 mb-4">Errors</h2>
          <div className="space-y-2">
            {researchState.errors.map((error, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        {researchState.status === 'completed' && (
          <button
            onClick={() => navigate(`/results/${researchId}`)}
            className="btn btn-primary flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            View Results
          </button>
        )}
        <button
          onClick={() => navigate('/research')}
          className="btn btn-outline"
        >
          Start New Research
        </button>
      </div>
    </div>
  )
}

export default WorkflowPage
