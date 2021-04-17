import { useContext, useEffect, useState } from "react";
import { DrizzleContext } from '@drizzle/react-plugin';
import BuyPet from "./BuyPet";
import OwnerTest from "./OwnerTest";

function AllPets() {

    const [dataKey, setDataKey] = useState(null);
    const drizzleData = useContext(DrizzleContext.Context)

    useEffect(() => {
        const { drizzle } = drizzleData;
        const contract = drizzle.contracts.petshop;

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["getAllPets"].cacheCall();

        // save the `dataKey` to local component state for later reference
        setDataKey(dataKey);
        //this.setState({ dataKey });
    })
    //console.log("read string props >> ",props);
    const { petshop } = drizzleData.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const myString = petshop.getAllPets[dataKey];
    return (
        <div>
            <div><h2>Pet List</h2></div>
            <p> {myString && myString.value.map((item, index) => {
                return <div key={index} className="box">
                    <div><img src={`https://ipfs.infura.io/ipfs/${item.image}`} width="320px" height="240px" maxWidth="100%" /></div>
                   <h4>Token Id: {item.tokenId}</h4>
                    <h4>Breed: {item.breed}</h4>
                    <h4>Location: {item.location}</h4>
                    <h4>Price: {item.price}</h4>
                    { item.owner != drizzleData.drizzleState.accounts[0] ? <OwnerTest tokenId={item.tokenId} price={item.price} owner={item.owner} /> : <h6>Owner: {item.owner}</h6> }
                </div>
            })}</p>
        </div>
    );
}

export default AllPets