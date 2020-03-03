import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { surveilAll, getCameras } from '../backendLogic/BusinessLogic';
import Griddle, {plugins} from 'griddle-react';

class blacklistTable extends Component {

    constructor(props) {
        super(props);
        this.props.getCameras();
        this.state = {
            cameras:this.props.cameras.cameras,
            settings:this.props.settings,
            blacklistData: [],
            
          }
        }


    componentDidMount() {
        if(this.props.auth.isAuthenticated === false) {
            this.props.history.push('/');
        }
        this._mounted = true;
        this.startTimer();
    }

    abortController= new AbortController();

    componentWillUnmount(){
        this.stopTimer();
        this._mounted = false;
        this.abortController.abort();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated === false) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if(nextProps.cameras){
            this.setState({
                cameras:this.props.cameras.cameras,
                settings:this.props.settings,
            })
        }
    }

    startTimer(){
        if(!this.timerId){     
          this.timerId = setInterval(()=>{
            surveilAll(this.state.settings).then(result => {
                var newState = this.state;
                newState.blackListData = result;
                console.log(result);
            if(this._mounted === true){
                this.setState(newState);
            }
            }).catch(err => {
                console.log(err.response.data)
            });
            
          }, 3000);
        }
      }
      
      stopTimer(){
        clearInterval(this.timerId);
      }

    render() {
        const styleConfig = {
            icons: {
              TableHeadingCell: {
                sortDescendingIcon: '▼',
                sortAscendingIcon: '▲',
              },
            },
            classNames: {
              Row: 'row-class',
              Table: 'table-striped, table',
            },
            styles: {
              Filter: { fontSize: 18 },
            },
          };
        var data = this.state.result;
        return(
        <div className="container" style={{ marginTop: '50px', width: '1000px'}}>
        <Griddle results={data}
        plugins={[plugins.LocalPlugin]}
        styleConfig={styleConfig}/>
        </div>

        )
    }
}

blacklistTable.propTypes = {
    getCameras: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    cameras: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    cameras: state.cameras,
    settings: state.settings
})

export default connect(mapStateToProps, { getCameras })(blacklistTable);