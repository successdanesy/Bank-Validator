import { Routes, Route } from 'react-router-dom'
import Validator from './pages/validator'   // or whatever your main page is
import Bankvalues from './pages/bankvalues'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Validator />} />
            <Route path="/bankvalues" element={<Bankvalues />} />
        </Routes>
    )
}
