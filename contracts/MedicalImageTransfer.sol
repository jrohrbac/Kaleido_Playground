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
        string metadata;
        string pointer;
    }
    struct Set{
        address[] addresses;
        mapping(address => bool) is_in;
    }
    mapping(address => Person) public userSchema;
    address[] public doctors;
    address[] public patients;
    mapping(address => bool) isUserExisted;
    mapping(uint => bool) isImageExist;
    mapping(address => mapping(uint => ImageData)) patientData;
    mapping(address => Set) patientAccessListForADoctor;
    uint256 public userCount;      
    uint256 public imgCount;
    uint256 public doctorsCount;
    uint256 public patientsCount;
  
    
    function addNewUser(string memory _name, Role _role) public {
        require(!isUserExisted[msg.sender]);
        require(bytes(_name).length > 0);
        require(uint(_role) < 2);
        userCount++;
        Person memory p = Person(userCount, msg.sender, _name, _role);
        userSchema[msg.sender] = p;
        isUserExisted[msg.sender] = true;
        if(uint(_role) == 0){
            doctors.push(msg.sender);
            doctorsCount++;
        }else{
            patients.push(msg.sender);
            patientsCount++;
        }
    }
    
    function uploadImage(string memory metadata, string memory pointer) public {
        require(isUserExisted[msg.sender]);
        uploadImage(userSchema[msg.sender], metadata, pointer);
    }
    function uploadImage(Person memory _p, string memory metadata, string memory pointer) private {
        require(_p.role == Role.Patient);
        imgCount++;
        patientData[_p.ads][imgCount] = ImageData(imgCount, _p, metadata, pointer);
        isImageExist[imgCount] = true;
    }
    
    function getImageData(address _patient, uint _imgId) public returns (string memory metadata, string memory pointers){
        require(isUserExisted[msg.sender]);
        require(isUserExisted[_patient]);
        return getImageData(userSchema[msg.sender], userSchema[_patient], _imgId);
    }
    function getImageData(Person memory _doctor, Person memory _patient, uint _imgId) private returns (string memory metadata, string memory pointers) {
        require(_doctor.role == Role.Doctor);
        require(_patient.role == Role.Patient);
        require(isImageExist[_imgId]);
        ImageData memory img = patientData[_patient.ads][_imgId];
        if(!patientAccessListForADoctor[_doctor.ads].is_in[_doctor.ads]){
            patientAccessListForADoctor[_doctor.ads].addresses.push(_doctor.ads);
            patientAccessListForADoctor[_doctor.ads].is_in[_doctor.ads] = true;
        }
        return (img.metadata, img.pointer);
        
    }
    
}