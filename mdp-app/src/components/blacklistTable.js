import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { surveilAll, getCameras } from '../backendLogic/BusinessLogic';
import Griddle, {plugins} from 'griddle-react';

var counter =1;

function getCurrentTimeFromStamp (timestamp) {
    var d = new Date(timestamp);
    var timeStampCon = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear() + " " + d.getHours() + ':' + d.getMinutes();

    return timeStampCon;
};

class blacklistTable extends Component {

    constructor(props) {
        super(props);
        this.props.getCameras();
        this.state = {
            cameras:this.props.cameras.cameras,
            settings:this.props.settings,
            
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
                newState.blackListData = [];
                counter+=1;
                newState.counter= counter;
                for(var instance=0; instance<result.length; instance++){
                    var entry={};
                    entry.ID=result[instance].ID;
                    entry.Time=getCurrentTimeFromStamp(result[instance].Time);
                    entry.NbrPlate=result[instance].NbrPlate;
                    newState.blackListData.push(entry)
                }
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
            Layout: 'griddle griddle-container',
            },
          };
        var data = this.state.blackListData;
        console.log(data);
        return(
        <div className="container half-black" style={{ marginTop: '50px', width: '1000px'}}>
        <hr></hr>
        <Griddle
            data={data}
            plugins={[plugins.LocalPlugin]}
            styleConfig={styleConfig}/>
            <hr></hr>
            <hr></hr>
            <hr></hr>
        </div>)
        

        
        
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