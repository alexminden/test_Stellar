pragma solidity >=0.4.0 <0.6.0;

contract air {
    // Event after registration/de−registration
    event deviceEvent(address indexed _from, string _message);
    event setFileHashEvent(address indexed _from, string message);

    // Struct to store the file−hashes which store the actual sensor data
    struct SensorData {
        string filehash;
    }

    uint public currentID;
    address private createdBy;

    // Map the struct to an id
    mapping(uint=> SensorData) sensorStore;
    // Store registered addresses in mapping
    mapping (address=> bool) private trustedAddresses;

    // Constructor for the smart-contract
    constructor() public {
        currentID = 1;
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
    function setSensorData(string memory filehash) public {
        if(devicePresent(msg.sender)) {
            uint idToStore = getCurrentID();
            SensorData storage sensorReadings = sensorStore[idToStore];
            sensorReadings.filehash  = filehash;
            incrementCurrentID();
            emit setFileHashEvent(msg.sender,"FILEHASH TXN CALLED");
        } else{
            emit setFileHashEvent(msg.sender,"DEVICE NOT REGISTERED");
        }
    }

    // Function to get latest stored data
    function getSensorDataLatest() public view returns (string memory){
        if(devicePresent(msg.sender)) {
            SensorData storage sensorReadings = sensorStore[getCurrentID() - 1];
            return sensorReadings.filehash;
        }
        return "DEVICE NOT REGISTERED";
    }

    // Function to get data stored under some ID
    function getSensorDataByID(uint ID) public view returns (string memory) {
        if(devicePresent(msg.sender)) {
            SensorData storage sensorReadings = sensorStore[ID];
            return sensorReadings.filehash;
        }
        return "DEVICE NOT REGISTERED";
    }

    //function to check if device is registered
    function devicePresent(address addressToAdd) public view returns (bool){
        return trustedAddresses[addressToAdd];
    }

    //register IoT device
    function registerDevice(address addressToAdd) ownerOnly public  {
        if(devicePresent(addressToAdd)) {
            emit deviceEvent(addressToAdd, "DEVICE ALREADY REGISTERED");
        }
        trustedAddresses[addressToAdd] = true;
        emit deviceEvent(addressToAdd, "SUCESSFULLY REGISTERED");
    }


    //deregister IoT device
    function deregisterDevice(address addressToRemove) ownerOnly public {
        if(!devicePresent(addressToRemove)) {
            emit deviceEvent(addressToRemove, "DEVICE NOT REGISTERED");
        }
        trustedAddresses[addressToRemove] = false;
        emit deviceEvent(addressToRemove, "SUCESSFULLY DEREGISTERED");
    }
}
