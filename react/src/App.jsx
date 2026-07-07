import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import BaseLayout from "./components/BaseLayout"
import Home from "./pages/Home"
import Register from "./components/RegisterForm"

function App() {
    return (
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Home />}/>
            <Route path="register" element={<Register />}/>
          </Route>
        </Routes>
      </Router>
    )
}

export default App