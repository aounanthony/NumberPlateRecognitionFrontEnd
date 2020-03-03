import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';

class Navbar extends Component {

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                <Link className="nav-link" to="/blacklistTable"><b>Table</b></Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/settings"><b>Settings</b></Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/Map"><b>Map</b></Link>
                </li>
                <a href="/" className="nav-link" onClick={this.onLogout.bind(this)}>
                <b>Logout</b>
                </a>
            </ul>
        )
      const guestLinks = (
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/register"><b>Register</b></Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/login"><b>Login</b></Link>
            </li>
        </ul>
      )
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/"><b>DETEKT</b></Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        )
    }
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    settings: state.settings
})

export default connect(mapStateToProps, { logoutUser })(withRouter(Navbar));