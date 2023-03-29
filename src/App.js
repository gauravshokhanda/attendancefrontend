import React, { useEffect, useState } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios  from 'axios';


function DemoApp() {
  const [events, setEvents] = useState([]);


  const fetchEvents = async () => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/employes/attendance',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.request(config);
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
 

  const handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event');
    let isPresent = prompt('Is the student present? (yes/no)') === 'yes';

    if (title) {
      axios
        .post('http://localhost:3000/employes/attendance', {
          studentId: title,
          present: isPresent,
          date: selectInfo.startStr,
        })
        .then((response) => {
          console.log(response,"response")
          fetchEvents()
        
          console.log('Attendance recorded successfully');
        })
        .catch((error) => {
          console.error('Error recording attendance', error);
        });
    }
  };

      useEffect(()=>{
        fetchEvents()
      },[])


      const eventClickInfo = (info)=> {
    
        let title = prompt('Update Your name');
        let isPresent = prompt('Is the student present? (yes/no)') === 'yes';

        if (title) {
          axios
            .put('http://localhost:3000/employes/attendance', {
              id:info.event.id,
              studentId: title,
              present: isPresent
            })
            .then((response) => {
              console.log(response,"response")
              fetchEvents()
            
              console.log('Attendance updated successfully');
            })
            .catch((error) => {
              console.error('Error recording attendance', error);
            });
        }
      }

    const transformedEvents =   events?.map((event) => ({
      title: event.studentId,
      date: new Date(event.date).toISOString().substring(0, 10),
      backgroundColor: event.present ? 'green' : 'red',
      id:event._id
    }));

    console.log(transformedEvents)





  // const eventsDATA = [
  //   { title: "event 1", date: "2023-03-07" ,backgroundColor:'green'},
  //   { title: "event 2", date: "2023-03-17" }
  // ];

  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          eventClick={eventClickInfo }
          dayMaxEvents={true}
          events={transformedEvents}
          select={handleDateSelect}
        
        />
      </div>
    </div>
  );
}

export default DemoApp;
