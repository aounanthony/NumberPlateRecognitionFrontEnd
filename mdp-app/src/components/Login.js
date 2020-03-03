import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import classnames from 'classnames';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            Email: '',
            Password: '',
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
            Email: this.state.Email,
            Password: this.state.Password,
        }
        this.props.loginUser(user);
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
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

    render() {
        const {errors} = this.state;
        return(
        
        <div className="container" style={{ marginTop: '50px', width: '700px'}}>
            <h2 style={{marginBottom: '40px'}}>Login</h2>
            <form onSubmit={ this.OnSubmitFunc }>
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
                    <button type="submit" className="btn btn-primary">
                        Login User
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)