import React, { useState, useContext } from 'react'
import { DrizzleContext } from '@drizzle/react-plugin';

export const RegisterPet = () => {

    const ipfsClient = require('ipfs-http-client')
    const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

    const [stackId, setStackId] = useState(null);
    const drizzleData = useContext(DrizzleContext.Context)

    const [image, setimage] = useState("")
    const [breed, setbreed] = useState("")
    const [location, setlocation] = useState("")
    const [price, setprice] = useState(0)

    const [buffer, setbuffer] = useState("")

    const getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = drizzleData.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[stackId];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // console.log("Transaction hash = ", txHash);
        // otherwise, return the transaction status

        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;

    };

    const setValue = async (image,breed,location,price) => {
        const { drizzle, drizzleState } = drizzleData;
        const contract = drizzle.contracts.petshop;

        ipfs.add(buffer, async (error, result) => {
            if (!error) {
                try {
                    image = result[0].hash;
                    console.log(image)
                    const stackId = await contract.methods["registerPet"].cacheSend(image, breed, location, price, {
                        from: drizzleState.accounts[0],
                    });

                    setStackId(stackId);
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    return (
        <div style={{border: '1px solid',padding:10, width:'250px',margin:'0 auto'}} >
            <input type="file" placeholder="Image" onChange={(e) => {
                e.preventDefault()
                const file = e.target.files[0]
                const reader = new window.FileReader()
                reader.readAsArrayBuffer(file)
                reader.onloadend = () => {
                    setbuffer(Buffer(reader.result))
                }
            }
            } ></input> <br />
            <input type="text" onChange={(e)=>{ setbreed(e.target.value)}} value={breed} placeholder="Breed" ></input> <br />
            <input type="text" placeholder="Location" value={location} onChange={(e)=>{ setlocation(e.target.value)}} ></input> <br />
            <input type="text" placeholder="Price" value={price} onChange={(e)=>{ setprice(e.target.value)}} ></input> <br />
            <button onClick={() => { setValue(image,breed,location,price) }} >Register Pet</button>

            <div>{getTxStatus()}</div>
        </div>
    )
}
