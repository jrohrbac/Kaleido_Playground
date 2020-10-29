import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../../actions/authActions";

class PatientDash extends Component {
    state = {
        selectedFile: null
    };

    // On file select, update state
    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
        console.log("Image type: " + typeof(selectedFile));
    };

    // On file upload, create and update formData object
    onFileUpload = () => {
        const formData = new FormData();
        const { user } = this.props.auth

        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        // Todo: Find out how to properly store image files to MongoDb (maybe use multer or GridFS)
        //var reader = new FileReader();
        //reader.readAsDataURL(this.state.selectedFile);
        //console.log(reader.result);
        // Store image in ImgSchema format and then add to user's pictures
        const img = {
            name: this.state.selectedFile.name,
            image: Buffer.from((this.state.selectedFile).toString('base64'), 'base64')
        };

        user.pictures.push(img);

        //Request to backend api and send formData object
        this.props.uploadImage(user);
    };

    // Display content on screen
    fileData = () => {
        // Images can be displayed using the following format:
        // <img src={URL.createObjectURL(this.state.selectedFile)} height={100} width={100} alt='xray'/>
        if (this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                    <br />
                    <h2>Gallery</h2>
                </div>
            );
        }
        else {
            return (
                <div>
                    <br />
                    <h4>Choose image before pressing the upload button</h4>
                </div>
            );
        }
    };

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
        console.log('logging out');
    };

    render() {
        const { user } = this.props.auth;
        console.log("User: " + JSON.stringify(user));

        return(
            <div style={{ height: "75vh" }} className="container valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <b>Hey there,</b> {user.name.split(" ")[0]}
                            <p className="flow-text grey-text text-darken-1">
                                You are logged into a full-stack{" "}
                                <span style={{ fontFamily: "monospace" }}>MERN </span>
                                app as a patient 👏
                            </p>
                        </h4>
                        <br />
                        <div>
                            <input type="file" onChange={this.onFileChange} />
                            <button onClick={this.onFileUpload}>
                                Upload image
                            </button>
                        </div>
                        {this.fileData()}
                        <br />
                        <button
                            style={{
                                width: "150px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            onClick={this.onLogoutClick}
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

PatientDash.propTypes = {
    uploadImage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser, uploadImage }
)(PatientDash);
