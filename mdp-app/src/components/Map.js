import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { getCameras, surveilAll} from '../backendLogic/BusinessLogic';
import L from 'leaflet';
import Routing from './MapComponents/Routing';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';

const cameraIcon = L.icon({ iconUrl: require('../ressources/Camera.png'),
iconSize:     [43, 27],})

const detectionIcon = L.icon({ iconUrl: require('../ressources/danger.png'),
iconSize:     [43, 27],})

var counter = 0;

function getCurrentTimeFromStamp (timestamp) {
    var d = new Date(timestamp);
    var timeStampCon = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear() + " " + d.getHours() + ':' + d.getMinutes();

    return timeStampCon;
};

export class MapComp extends Component{

    constructor(props) {
        super(props);
        this.props.getCameras();
        this.state = {
            lat: 33.8938,
            lng: 35.5018,
            zoom: 13,
            cameras:this.props.cameras.cameras,
            settings:this.props.settings,
            route:[],
            iterator:[1],
            maxZoom:21
          }
        }
    
    abortController= new AbortController();

    componentWillMount(){
        this.props.getCameras();
    }
    
    componentDidMount() {
        if(this.props.auth.isAuthenticated === false) {
            this.props.history.push('/');
        }
        this._mounted = true;
        this.startTimer();
    }
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
                lat: 33.8938,
                lng: 35.5018,
                zoom: 13,
                cameras:this.props.cameras.cameras,
                settings:this.props.settings,
                route:this.state.route,
                iterator:this.state.iterator,
                maxZoom:21
            })
        }
        
    }
    
    startTimer(){
        if(!this.timerId){     
          this.timerId = setInterval(()=>{
            surveilAll(this.state.settings).then(result => {
                var newState = this.state;
                newState.blackListData = result;
                for (var cameraInstance = 0; cameraInstance < newState.cameras.length; cameraInstance++) {
                    var detectionList=[];
                    for (var detection = 0; detection < result.length; detection++) {
                            if(newState.cameras[cameraInstance].ID === result[detection].ID){
                                newState.cameras[cameraInstance].detected = true;
                                detectionList.push(result[detection].NbrPlate.concat(' ').concat(getCurrentTimeFromStamp(result[detection].Time)));
                            
                        }
                    }
                    var description = "Detected Numbers:";                     
                    for (var entry = 0; entry < detectionList.length; entry++) {
                        description = description.concat(" ".concat(detectionList[entry]));
                    }     
                    newState.cameras[cameraInstance].description = description;              
                }
            if(this.props.settings.NbrPlate !== ""){
                var newRoute= [];
                for (var route = 0; route < result.length; route++) {
                    for (var camera = 0; camera < newState.cameras.length; camera++) {
                        if(newState.cameras[camera].ID === result[route].ID){
                            newRoute.push([newState.cameras[camera].Coordy,newState.cameras[camera].Coordx])
                        }
                    }
                }
                counter+=1;
                newState.counter=counter;
                newRoute.push(99999999);
                newState.route=newRoute;
                
                
            }
            
                
            if(this._mounted === true){
                this.setState(newState);
            }
            }).catch(err => {
                console.log(err.response.data)
            });
            
          }, 5000);
        }
      }
      
      stopTimer(){
        clearInterval(this.timerId);
      }


    getIcon (entry) {
        if(entry.detected===true){
            return detectionIcon;
        }
        else{
            return cameraIcon;
        }
    }

    saveMap = map => {
        this.map = map;
        this.setState({
          isMapInit: true
        });
      };


  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom} ref={this.saveMap} maxZoom={this.state.maxZoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
        {this.state.cameras.map((data)=>
            <Marker icon={this.getIcon(data)} key={`camera-${data.ID}`} position={[data.Coordy, data.Coordx]}>
                <Popup>
                <span>{`ID: ${data.ID}`}<br/>{`${data.description}`}</span>
                </Popup>
            </Marker>,
        )}
        </MarkerClusterGroup>
        {this.state.route.map((data)=>this.state.settings.NbrPlate!=="" && data === 99999999 && <Routing map={this.map} route={this.state.route}/>)}
      </Map>
    )
  }
}

MapComp.propTypes = {
    getCameras: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    cameras: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
    cameras: state.cameras,
    settings: state.settings,
})

export  default connect(mapStateToProps, { getCameras })(MapComp)