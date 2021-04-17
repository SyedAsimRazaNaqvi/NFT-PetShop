pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol" ;
pragma experimental ABIEncoderV2;

contract petshop is ERC721URIStorage{
    
    uint public _tokenId;
    
    struct Pet{
        uint tokenId;
        string image;
        string breed;
        string location;
        uint price;
        address owner;
        bool sold;
    }
    
    constructor() public ERC721("PET SHOP", "PS"){
        
    }
    Pet[] PetList;
    mapping(address => Pet) public myPets;
    mapping(uint => Pet) public AllPets;
    event pets( uint tokenId,
        string image,
        string breed,
        string location,
        uint price,
        address owner,
        bool sold);
    
    function registerPet (string memory _image, string memory _breed, string memory _location, uint _price  ) public returns( bool){
        
       _tokenId++;
        
        address payable _owner =payable(msg.sender);
        Pet memory temp;
        
        temp = Pet({
            tokenId:_tokenId,
            image:_image,
            breed:_breed,
            location:_location,
            price:_price,
            owner:_owner,
            sold: false
        });
            
        myPets[msg.sender] = temp;
        AllPets[_tokenId] = temp;
        
        PetList.push(temp);
        _mint(msg.sender,_tokenId);
        
        _setTokenURI(_tokenId,_image);
        emit pets(_tokenId,_image,_breed,_location,_price,_owner,false);
        return true;
    }
    
    function buyPet (uint256 tokenId) payable public returns(bool){
        
        require ( _exists(tokenId), "This token is not exist" );
        require( tokenId > 0,"Token id does not overflow ");
        require(msg.value > 0, "Error: Ether(s) not provided ");
     
        address payable _ownerAddress =payable(AllPets[tokenId].owner);
        require(myPets[_ownerAddress].owner != msg.sender," Owner of the Pet can not call this function ");
        bool isFundSend =  _ownerAddress.send(msg.value);
        _transfer(_ownerAddress, msg.sender, tokenId);
        
        return isFundSend;
    }

    function getAllPets() public view returns (Pet[] memory) {
        return PetList;
    }

}