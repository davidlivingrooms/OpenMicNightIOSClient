var React = require('react-native');
var t = require('tcomb-form-native');
var {
  AppRegistry,
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  Component,
  PickerIOS,
  DatePickerIOS
} = React;

var Form = t.form.Form;

var WeekDay = t.enums({
  'sunday': 'Sunday',
  'monday': 'Monday',
  'tuesday': 'Tuesday',
  'wednesday': 'Wednesday',
  'thursday': 'Thursday',
  'friday': 'Friday',
  'saturday': 'Saturday'
});

var Regularity = t.enums({
  'weekly': 'Weekly',
  'bi-weekly': 'Bi-weekly',
  'monthly': 'Monthly'
});

var OpenMic = t.struct({
  openMicName: t.Str,
  comedians: t.Bool,
  musicians: t.Bool,
  poets: t.Bool,
  venueName: t.maybe(t.Str),
  venueAddress: t.Str,
  city: t.Str,
  state: t.Str,
  contactEmailAddress: t.maybe(t.Str),
  contactPhoneNumber: t.maybe(t.Str),
  signUpTime: t.Date,
  startTime: t.Date,
  openMicRegularity: Regularity,
  openMicWeekDay: WeekDay,
  nextOpenMicDate: t.Str,
  isOpenMicFree:t.Bool,
  otherNotes: t.maybe(t.Str)
});

var OpenMicWeekly = t.struct({
  openMicName: t.Str,
  comedians: t.Bool,
  musicians: t.Bool,
  poets: t.Bool,
  venueName: t.maybe(t.Str),
  venueAddress: t.Str,
  city: t.Str,
  state: t.Str,
  contactEmailAddress: t.maybe(t.Str),
  contactPhoneNumber: t.maybe(t.Str),
  signUpTime: t.Date,
  startTime: t.Date,
  openMicRegularity: Regularity,
  sunday: t.Bool,
  monday: t.Bool,
  tuesday: t.Bool,
  wednesday: t.Bool,
  thursday: t.Bool,
  friday: t.Bool,
  saturday: t.Bool,
  nextOpenMicDate: t.Str,
  isOpenMicFree:t.Bool,
  otherNotes: t.maybe(t.Str)
});

var options = {
  fields: {
    isOpenMicFree: {
        label: 'Is this Open Mic Free?'
    },
    signUpTime: {
        mode: 'time',
    },
    startTime: {
        mode: 'time'
    },
    otherNotes: {
        //placeholder: 'Opmerking',
        //multiline: true
    }
  }
};

class AddOpenMicForm extends Component {

    //static defaultProps = {
    //    date: new Date(),
    //    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
    //};

    constructor(props) {
        super(props);
        this.state = {
            type: OpenMic,
            value: this.props.openmic ? this.getOpenMicStateFromProp() : null,
            date: this.props.date,
            timeZoneOffsetInHours: this.props.timeZoneOffsetInHours
        };
    }

  getOpenMicStateFromProp(){
      var openMic = this.props.openmic;
      return {
          openMicName: openMic.openmic_name,
          comedians: openMic.comedian,
          musicians: openMic.musician,
          poets: openMic.poet,
          venueName: openMic.venue_name,
          venueAddress: openMic.venue_address,
          city: openMic.city,
          state: openMic.state,
          contactEmailAddress: openMic.contact_email_address,
          contactPhoneNumber: openMic.contact_phone_number,
          signUpTime: new Date(openMic.sign_up_time),
          startTime: new Date(openMic.start_time),
          openMicRegularity: openMic.openmic_regularity,
          openMicWeekDay: openMic.openmic_weekday,
          nextOpenMicDate: openMic.next_openmic_date,
          isOpenMicFree: openMic.is_free,
          otherNotes: openMic.notes
      };
  }

    onDateChange(date) {
        this.setState({date: date});
    };

    onTimezoneChange(event) {
    var offset = parseInt(event.nativeEvent.text, 10);
    if (isNaN(offset)) {
        return;
    }
    this.setState({timeZoneOffsetInHours: offset});
    };

  //saveOpenMic(openmic) {
  //
  //}

  onPress() {
    // call getValue() to get the values of the form
    var openmic = this.refs.form.getValue();
    if (openmic) { // if validation fails, value will be null
        fetch('http://localhost:3000/api/openmic/save', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(openmic)
        }).then((response) => {
                console.log(response.text());
            })
            .catch((error) => {
                console.warn(error);
            });
      //this.saveOpenMic(value);
    }
  }

  onChange(value) {
    if (value.openMicRegularity === 'weekly') {
        this.setState({type: OpenMicWeekly, value: value});
    }
    else{
        this.setState({type: OpenMic, value: value});
    }
  }


  render() {
    return (
      <ScrollView
        scrollEventThrottle={200}
        contentInset={{top: -50}}
        style={styles.scrollView}>

        <View style={styles.container}>
          {/* display */}
          <Form
            ref="form"
            type={this.state.type}
            options={options}
            onChange={this.onChange.bind(this)}
            value={this.state.value}
            />
          <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#2196F3'
    },
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#2196F3'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingRight: 8,
        paddingLeft: 8,
    },
    scrollView: {
        backgroundColor: '#6A85B1',
        height: 300,
    }
});

module.exports = AddOpenMicForm;