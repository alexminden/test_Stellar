pragma solidity >=0.4.0 <0.6.0;

contract airContract {

    event setFileHashEvent(address indexed _from, bytes32 message);

    // Struct to store the file−hashes which store the actual sensor data
    struct SensorData {
        bytes32 ipfsHash;
    }

    uint public currentID;
    address private createdBy;

    // Map the struct to an id
    mapping(uint=> SensorData) sensorStore;

    // Constructor for the smart-contract
    constructor() public {
        currentID = 0;
        createdBy = msg.sender;
    }

    // Modify some functions to be executed only by the Contract creator
    modifier ownerOnly{
        require(msg.sender == createdBy);
        _;
    }

    // Function to get the currentID
    function getCurrentID() public view returns(uint) {
        return currentID;
    }
    // Function to increment the ID used internally for managing file-hashes
    function incrementCurrentID() public  {
        currentID++;
    }

    // Function to store the filehash from swarm
    function setSensorData(bytes32 _filehash) ownerOnly public {
        uint idToStore = getCurrentID();
        sensorStore[idToStore].ipfsHash = _filehash;
        incrementCurrentID();
        emit setFileHashEvent(msg.sender,_filehash);
    }

    // Function to get latest stored data
    function getSensorDataLatest() ownerOnly public view returns (bytes32){
        SensorData storage sensorReadings = sensorStore[getCurrentID() - 1];
        return sensorReadings.ipfsHash;
    }

    // Function to get data stored under some ID
    function getSensorDataByID(uint _ID) ownerOnly public view returns (bytes32) {
        SensorData storage sensorReadings = sensorStore[_ID];
        return sensorReadings.ipfsHash;
    }    
}
