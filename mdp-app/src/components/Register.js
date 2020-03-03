import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../actions/authentication';
import classnames from 'classnames';

class Register extends Component {

    constructor() {
        super();
        this.state = {
            LastName: '',
            FirstName: '',
            Email: '',
            Password: '',
            Password_Confirm: '',
            errors: {}
        }
        this.OnInputFunc = this.OnInputFunc.bind(this);
        this.OnSubmitFunc = this.OnSubmitFunc.bind(this);
    }

    OnInputFunc(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    OnSubmitFunc(e) {
        e.preventDefault();
        const user = {
            LastName: this.state.LastName,
            FirstName: this.state.FirstName,
            Email: this.state.Email,
            Password: this.state.Password,
            Password_Confirm: this.state.Password_Confirm
        }
        this.props.registerUser(user, this.props.history);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    render() {
        const { errors } = this.state;
        return(
        <div className="container half-black" style={{ marginTop: '50px', width: '700px' }}>
        <hr></hr>
            <h2 style={{marginBottom: '40px'}}>Registration</h2>
            <form onSubmit={ this.OnSubmitFunc }>
                <div className="form-group">
                    <input
                    type="text"
                    placeholder="First Name"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.FirstName
                    })}
                    name="FirstName"
                    onChange={ this.OnInputFunc }
                    value={ this.state.FirstName }
                    />
                    {errors.FirstName && (<div className="invalid-feedback">{errors.FirstName}</div>)}
                </div>
                <div className="form-group">
                    <input
                    type="text"
                    placeholder="Last Name"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.LastName
                    })}
                    name="LastName"
                    onChange={ this.OnInputFunc }
                    value={ this.state.LastName }
                    />
                    {errors.LastName && (<div className="invalid-feedback">{errors.LastName}</div>)}
                </div>
                <div className="form-group">
                    <input
                    type="email"
                    placeholder="Email"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.Email
                    })}
                    name="Email"
                    onChange={ this.OnInputFunc }
                    value={ this.state.Email }
                    />
                    {errors.Email && (<div className="invalid-feedback">{errors.Email}</div>)}
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Password"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.Password
                    })}
                    name="Password"
                    onChange={ this.OnInputFunc }
                    value={ this.state.Password }
                    />
                    {errors.Password && (<div className="invalid-feedback">{errors.Password}</div>)}
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Confirm Password"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.Password_Confirm
                    })}
                    name="Password_Confirm"
                    onChange={ this.OnInputFunc }
                    value={ this.state.Password_Confirm }
                    />
                    {errors.Password_Confirm && (<div className="invalid-feedback">{errors.Password_Confirm}</div>)}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Register User
                    </button>
                </div>
                <hr></hr>
                <hr></hr>
            </form>
        </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps,{ registerUser })(withRouter(Register))