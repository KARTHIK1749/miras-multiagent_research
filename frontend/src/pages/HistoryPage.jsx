import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Calendar, Clock, Target, FileText, 
  ExternalLink, Trash2, AlertCircle, Loader2
} from 'lucide-react'

const HistoryPage = () => {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async (search) => {
    try {
      const url = search 
        ? `/api/history?search=${encodeURIComponent(search)}`
        : '/api/history'
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch history')
      
      const data = await response.json()
      setEntries(data.entries || [])
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    fetchHistory(searchQuery)
  }

  const handleDelete = async (memoryId) => {
    if (!confirm('Are you sure you want to delete this research entry?')) return

    setDeleting(memoryId)
    try {
      const response = await fetch(`/api/history/${memoryId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete entry')
      
      setEntries(entries.filter(entry => entry.id !== memoryId))
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getExecutionTime = (results) => {
    return results?.execution_time ? `${Math.round(results.execution_time)}s` : 'N/A'
  }

  const getRisScore = (results) => {
    return results?.ris_score?.final_score || 'N/A'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research History</h1>
          <p className="text-gray-600">View and manage your past research sessions</p>
        </div>
        <button
          onClick={() => navigate('/research')}
          className="btn btn-primary"
        >
          Start New Research
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research history..."
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {entries.length === 0 ? (
        <div className="card text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No matching research found' : 'No research history yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Try a different search term or clear the search to see all research.'
              : 'Start your first research to see it appear here.'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setLoading(true)
                fetchHistory()
              }}
              className="btn btn-outline"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {entry.query}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      ID: {entry.research_id}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(entry.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getExecutionTime(entry.results)}
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      RIS: {getRisScore(entry.results)}
                    </div>
                  </div>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="font-medium">Literature:</span> {entry.results?.literature_results || 0} sources
                      </div>
                      <div>
                        <span className="font-medium">Web:</span> {entry.results?.web_results || 0} resources
                      </div>
                      <div>
                        <span className="font-medium">Gaps:</span> {entry.results?.gaps_identified?.length || 0} identified
                      </div>
                      <div>
                        <span className="font-medium">Hypotheses:</span> {entry.results?.hypotheses?.length || 0} generated
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => navigate(`/results/${entry.research_id}`)}
                    className="btn btn-outline btn-sm flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleting === entry.id}
                    className="btn btn-outline btn-sm text-red-600 hover:text-red-700 hover:border-red-300 flex items-center"
                  >
                    {deleting === entry.id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {entries.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">History Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {entries.length}
              </div>
              <div className="text-sm text-gray-600">Total Research Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {entries.reduce((sum, entry) => sum + (entry.results?.literature_results || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Literature Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {entries.reduce((sum, entry) => sum + (entry.results?.gaps_identified?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Research Gaps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(
                  entries.reduce((sum, entry) => sum + (getRisScore(entry.results) !== 'N/A' ? parseFloat(getRisScore(entry.results)) : 0), 0) / 
                  entries.filter(entry => getRisScore(entry.results) !== 'N/A').length
                ) || 0}
              </div>
              <div className="text-sm text-gray-600">Average RIS Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
