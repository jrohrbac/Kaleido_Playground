import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { checkUserRole } from "../../actions/authActions";


const PrivateRoute = ({ component: Component, auth, checkUserRole, ...rest }) => {

    useEffect(() => {
        console.log(auth)

        checkUserRole(
            { email: auth.user.email }
        )
    }, [])
    return (
        <Route
            {...rest}
            render={props =>
                !auth.isAuthenticated ? (
                    <Redirect to="/login" />
                )
                    : auth.user.role === auth.role
                        ? (
                            <Component {...props} />
                        ) : (
                            <Redirect to="/login" />
                        )
            }
        />)
};

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
    checkUserRole: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { checkUserRole })(PrivateRoute);
