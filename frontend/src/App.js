import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Category from './components/Category';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Category/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
