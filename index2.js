const { google } = rqquire('googleapis')

const { OAuth2 } = google.OAuth2
const oAuth2Cient = new OAuth2('752309970160-4lihqolcvqbelvgosn9nq4n13ktjc0s4.apps.googleusercontent.com', 'cjM1Mu96wsMI3ep6rfG1fDY5')

//set the refresh token?

oAuth2Cient.setCredentials({
  refresh_token:
    '1//04N8v2DJ2atxMCgYIARAAGAQSNwF-L9Irb0XdhWYwp-91qSDcIqkVOoGLkV3HkqVrXtiznECGsrYTq7U06w8LMBzsJZTusOdLf7s'
})

//declare a calendar instance
const calendar = google.calendar({version: 'v3', auth: oAuth2Client})


//replace these variables with number from forms

const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2) //set the event for tomorrow? - start time is day in advance

const eventEndTime = newDate()
eventEndTime.setDate(eventEndTime.getDay() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)


//creating an event
const event = {
  summary: 'Meeting with Dave',
  location: '3901 Walnut St, Philadelphia, PA 19104',
  description: 'Meeting',
  start: {
      dateTime: eventStartTime,
      timeZone: 'America/Denver',
  },
  end: {
    dataTime: eventEndTime,
    timeZone: 'America/Denver',

  },
  
  colorId: 1,

}

calendar.freebusy.query({
  resource: {
    timeMin: eventStartTime,
    timeMax:eventEndTime,
    timeZone: 'American/Denver',
    items: {id: 'primary'}, //an array of calendars, id = id of calendar //for every calendar, checking if they're free or busy
  }
}, (err, res) => {
  if(err) return console.error('free busy query error', err)

  const eventsArr = res.data.calendars.primary.busy //this is teh events array
  //in object, theres an object called data, within data, there's calandars, could loop over calendars

  //check if theis array exists or if its empty
  if(eventsArr.length === 0) {
    return calendar.events.insert({ calendarId: 'primary', resource: event}, error => {
      if (err){
        return console.error('Calendar event creationn Error', err)
      }

      return console.log('Calendar Event Created')
      
    }) //pass event object in as resource
  
    return console.log('sorry busy')
  }


})



