var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadApts = JSON.parse(fs.readFileSync(dataLocation));

var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
var AptList = require('./AptList');
var Toolbar = require('./Toolbar');
var AddAppointment = require('./AddAppointment');
var HeaderNav = require('./HeaderNav')

var MainInterface = React.createClass({
  getInitialState: function() {
    return {
      aptBodyVisible: false,
      queryText: '',
      myAppointments: loadApts
    }//return
  }, //getInitialState
  componentDidUpdate: function() {
    fs.writeFile(dataLocation, JSON.stringify(this.state.myAppointments), 'utf8', 
        function(err) {
            if(err) {
                console.log(err);
            }
        }
    );
  },
  toggleAptDisplay: function() {
    var tempVisibility = !this.state.aptBodyVisible;
    this.setState({
        aptBodyVisible: tempVisibility
    });
  },
  showAbout: function() {
    ipc.sendSync('openInfoWindow');
  },
  addItem: function(tempItem) {
      var tempApts = this.state.myAppointments;
      tempApts.push(tempItem);
      this.setState({
          myAppointments: tempApts,
          aptBodyVisible: false
      })
  }
  ,
  deleteMessage: function(item) {
    var allApts = this.state.myAppointments;
    var newApts = _.without(allApts, item);
    this.setState({
        myAppointments: newApts
    });
  },
  searchApts: function(query) {
    this.setState({
        queryText: query
    })
  },
  render: function() {
    var filteredApts = [];
    var queryText = this.state.queryText;
    var myAppointments = this.state.myAppointments;

    for (var i = 0; i < myAppointments.length; i++) {
        if ( 
            (myAppointments[i].petName.toLowerCase().indexOf(queryText)!=-1) ||
            (myAppointments[i].ownerName.toLowerCase().indexOf(queryText)!=-1) ||
            (myAppointments[i].aptDate.toLowerCase().indexOf(queryText)!=-1) ||
            (myAppointments[i].aptNotes.toLowerCase().indexOf(queryText)!=-1)
          ) {
            filteredApts.push(myAppointments[i]);
          }
    }

    if(this.state.aptBodyVisible === true) {
        $('#addAppointment').modal('show');
    } else {
        $('#addAppointment').modal('hide');
    }
    filteredApts = filteredApts.map(function(item, index) {
        return(
            <AptList 
                key={index} 
                singleItem={item} 
                whichItem={item}
                onDelete={this.deleteMessage}
            />
        )
    }.bind(this));

    return(

      <div className="application">
          <HeaderNav
            onSearch={this.searchApts}
          />
        <div className="interface">
            <Toolbar 
                handleToggle={this.toggleAptDisplay}
                handleAbout={this.showAbout}
            />
            <AddAppointment
                handleToggle = {this.toggleAptDisplay}
                addApt = {this.addItem}
            />
            <div className="container">
            <div className="row">
            <div className="appointments col-sm-12">
                <h2 className="appointments-headline">Current Appointments</h2>
                <ul className="item-list media-list">{filteredApts}</ul>
            </div>{/* col-sm-12 */}
            </div>{/* row */}
            </div>{/* container */}
        </div>
      </div>

    );
  } //render
});//MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('petAppointments')
); //render
