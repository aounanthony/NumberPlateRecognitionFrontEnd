import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { postSettings } from '../backendLogic/BusinessLogic';
import classnames from 'classnames';
import Select from 'react-select';


const options = [
    { value: 'addNumber', label: 'Add Number' },
    { value: 'removeNumber', label: 'Remove Number' },
    { value: 'removeAll', label: 'Remove All' },
    { value: 'trackNumber', label: 'Track Number' },
    { value: 'trackAll', label: 'Track All' },
  ];

class Settings extends Component {

    constructor() {
        super();
        this.state = {
            NbrPlate: '',
            Action:null,
            errors: {}
        }
        this.OnInputFunc = this.OnInputFunc.bind(this);
        this.OnSubmitFunc = this.OnSubmitFunc.bind(this);
    }
    
    handleChange = (selectedAction) => {
        this.setState({ Action: selectedAction.value });
      }

    OnInputFunc(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    OnSubmitFunc(e) {
        e.preventDefault();
        const settings = {
            NbrPlate: this.state.NbrPlate,
            Action: this.state.Action
        }
        this.props.postSettings(settings);
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated === false) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated === false) {
            this.props.history.push('/')
        }
        if(nextProps){
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        const { selectedAction, errors } = this.state;
        return(
        
        <div className="container" style={{ marginTop: '50px', width: '700px'}}>
            <h2 style={{marginBottom: '40px'}}>Settings</h2>
            <form onSubmit={ this.OnSubmitFunc }>
                <div className="form-group">
                    <input
                    type="text"
                    placeholder="Number Plate"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.NbrPlate
                    })}
                    name="NbrPlate"
                    onChange={ this.OnInputFunc }
                    value={ this.state.NbrPlate }
                    />
                    {errors.NbrPlate && (<div className="invalid-feedback">{errors.NbrPlate}</div>)}
                </div>
                <div className="form-group">
                        <Select
                            value={selectedAction}
                            onChange={this.handleChange}
                            options={options}
                        />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

Settings.propTypes = {
    postSettings: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
    settings: state.settings,
})

export  default connect(mapStateToProps, { postSettings })(Settings)