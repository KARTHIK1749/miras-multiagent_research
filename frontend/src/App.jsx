import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ResearchPage from '@/pages/ResearchPage'
import WorkflowPage from '@/pages/WorkflowPage'
import ResultsPage from '@/pages/ResultsPage'
import HistoryPage from '@/pages/HistoryPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/workflow/:researchId" element={<WorkflowPage />} />
        <Route path="/results/:researchId" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Layout>
  )
}

export default App
