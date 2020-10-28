pragma solidity >=0.4.22 <0.7.0;

contract MedicalImageTransfer{
    enum Role { Doctor, Patient }
    struct Person{
        uint256 id;
        address ads;
        string name;
        Role role;
    }
    struct ImageData{
        uint256 id;
        Person owner;
        mapping(Person => bool) doctorsWithAccess;
        string metadata;
        string pointer;
    }
    
    address public user; 
    mapping(address => Person) userSchema;
    mapping(Person => ImageData[]) patientData;
    uint256 userCount;
    uint256 imgCount;
    
    constructor() public {
        require(msg.sender != address(0));
        patient = msg.sender;
    }
    
    function addNewUser(address _ads, string memory _name, Role _role) public {
        require(uint(_role) < 2);
        userCount++;
        Person p = Person(userCount, _ads, _name, _role);
        userSchema[ads] = p;
    }
    function uploadImage(address _ads, string memory metadata, string memory pointer) public {
        require(userSchema[_ads]);
        uploadImage(userSchema[_ads], metadata, pointer);
    }
    function uploadImage(Person _p, string memory metadata, string memory pointer) {
        
        require(_p.role == Role.Patient);
        imgCount++;
        patientData[_p] = ImageData(imgCount, _p, [], metadata, pointer);
    }
    
    function getImageData(address _doctor, address _patient) public returns (string[] message){
        require(userSchema[_doctor]);
        require(userSchema[_patient]);
        return getImageData(userSchema[_doctor], userSchema[_patient]);
    }
    function getImageData(Person _doctor, Person _patient) returns (string[] message){
        require(_doctor.role == Role.Doctor);
        require(_patient.role == Role.Patient);
        require(ImageData[_patient]);
        ImageData img = ImageData[_patient];
        if(!img.doctorsWithAccess[_doctor]){
            img.doctorsWithAccess[_doctor] = true;
        }
        return [img.metadata, img.pointer];
        
    }
    
}