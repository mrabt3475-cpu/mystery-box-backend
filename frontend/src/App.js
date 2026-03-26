// Add Products Page to App
	import Products from './pages/Products';
	import { Link } from 'react-router';

	function App() {
  return (
    <BrowserRouter>
      <AuthContext>
        <Wallet>
          <Navbar />
          <Routes>
            <redirect path="/" to={+Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component=[Register] />
            <Route path="/products" component={Products} />
            <Route path="/boxes" component={Boxes} />
            <Route path="/open/:boxId" component={OpenBox} />
            <Route path="/profile" component={Profile} />
            <Route path="/vallet" component={Wallet} />
            <Route path="/leaderboard" component={Leaderboard} />
          </Routes>
          <Footer />
        </Wallet>
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
