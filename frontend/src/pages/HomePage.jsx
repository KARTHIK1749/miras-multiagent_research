import { Link } from 'react-router-dom'
import { Brain, Search, Activity, FileText, ArrowRight, Zap, Database, BarChart } from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Multi-Agent Architecture',
      description: 'Eight specialized agents work together to provide comprehensive research insights'
    },
    {
      icon: Search,
      title: 'Unified Search',
      description: 'Search across arXiv, Semantic Scholar, Tavily, and Google simultaneously'
    },
    {
      icon: Activity,
      title: 'Live Workflow',
      description: 'Watch the research process unfold step-by-step with real-time updates'
    },
    {
      icon: Database,
      title: 'Memory System',
      description: 'Persistent research memory with semantic search capabilities'
    },
    {
      icon: BarChart,
      title: 'RIS Scoring',
      description: 'Research Impact Score evaluates novelty, feasibility, impact, and risk'
    },
    {
      icon: FileText,
      title: 'Comprehensive Reports',
      description: 'Detailed research reports with export capabilities'
    }
  ]

  const agents = [
    'Meta Agent', 'Literature Agent', 'Web Research Agent', 'Gap Agent',
    'Experiment Agent', 'Dataset Agent', 'Reflection Agent', 'RIS Agent'
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Brain className="h-16 w-16 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Multi-Agent Research Intelligence System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          MARIS is an autonomous research pipeline that uses multiple specialized AI agents 
          to perform end-to-end research with structured reasoning and stateful execution.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/research" className="btn btn-primary flex items-center">
            Start Research
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/history" className="btn btn-outline flex items-center">
            View History
            <FileText className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Workflow Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Research Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'Query Optimization',
            'Parallel Research',
            'Gap Analysis',
            'Experiment Design',
            'Dataset Recommendation',
            'RIS Scoring',
            'Reflection',
            'Final Report'
          ].map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-gray-900">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agents Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Specialized Agents
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <Zap className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">{agent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-primary-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Research?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Start using MARIS today and experience the power of multi-agent research intelligence. 
          Get comprehensive insights, identify research gaps, and evaluate impact potential.
        </p>
        <Link to="/research" className="btn btn-primary">
          Start Your First Research
        </Link>
      </div>
    </div>
  )
}

export default HomePage
