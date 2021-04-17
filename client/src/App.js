import './App.css';
import { useContext } from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import { RegisterPet } from './components/RegisterPet';
import AllPets from './components/AllPets';

function App() {
  // console.log("in app DrizzleContext = ", DrizzleContext)
  const drizzleData = useContext(DrizzleContext.Context)
  //console.log("in app drizzleData = ", drizzleData)

  if (!drizzleData.initialized) return <h3 style={{ textAlign: "center" }}>"Drizzle Loading..."</h3>;
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div> <h2>Register Pet</h2></div>
      <RegisterPet />
      <AllPets />
    </div>
  );
}

export default App;
